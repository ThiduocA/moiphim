using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using moiphim.Common.Errors;
using moiphim.DataAccess.Entities;
using moiphim.Services.Models.RequestModels.Movies;
using moiphim.Services.Models.ResponseModels.Movies;
using moiphim.Services.Results;
using moiphim.Services.Services.Interfaces;
using System.Text.Json;

namespace moiphim.Services.Services.Implementations;

public class MovieService : IMovieService
{
    private readonly moiphimDbContext _context;
    private readonly HttpClient _httpClient;

    public MovieService(moiphimDbContext context, HttpClient httpClient)
    {
        _context = context;
        _httpClient = httpClient;

        if (_httpClient.DefaultRequestHeaders.UserAgent.Count == 0)
        {
            _httpClient.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        }

        if (!_httpClient.DefaultRequestHeaders.Contains("Accept"))
        {
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }
    }

    public async Task<Result> LeechMoviesAsync(string apiUrl)
    {
        IDbContextTransaction transaction = null;
        try
        {
            var response = await _httpClient.GetAsync(apiUrl).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            var apiResponse = JsonSerializer.Deserialize<GetMovieDetailResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (apiResponse?.Status != true || apiResponse.Movie == null)
            {
                return Result.Failure(new Error("API_ERROR", "API returned unsuccessful response or no movie data"));
            }

            var item = apiResponse.Movie;
            string movieId = item.Id;

            // Bắt đầu transaction
            transaction = await _context.Database.BeginTransactionAsync();

            // Kiểm tra movie đã tồn tại
            var existingMovie = await _context.Movies
                .Include(m => m.MovieCategories)
                .Include(m => m.MovieCountries)
                .Include(m => m.MovieActors)
                .Include(m => m.MovieDirectors)
                .Include(m => m.Episodes)
                .Include(m => m.TMDBInfo)
                .Include(m => m.IMDbInfo)
                .FirstOrDefaultAsync(m => m.Id == movieId)
                .ConfigureAwait(false);

            Movie movie;
            bool isUpdate = false;

            if (existingMovie != null)
            {
                // Kiểm tra modified time để quyết định có cần update không
                var newModifiedTime = ParseToDateTimeUtc(item.Modified?.Time);
                if (newModifiedTime.HasValue && existingMovie.ModifiedAt.HasValue &&
                    existingMovie.ModifiedAt >= newModifiedTime)
                {
                    await transaction.RollbackAsync();
                    return Result.Success($"Movie {item.Name} is already up to date");
                }

                movie = existingMovie;
                isUpdate = true;

                // Xóa các relationship cũ
                await DeleteExistingRelationshipsAsync(movieId);
            }
            else
            {
                movie = new Movie { Id = movieId };
                _context.Movies.Add(movie);
            }

            // Cập nhật thông tin movie
            UpdateMovieProperties(movie, item);

            // Khởi tạo collections nếu chưa có
            movie.Episodes ??= new List<Episode>();
            movie.MovieCategories ??= new List<MovieCategory>();
            movie.MovieCountries ??= new List<MovieCountry>();
            movie.MovieActors ??= new List<MovieActor>();
            movie.MovieDirectors ??= new List<MovieDirector>();

            // Xử lý Episodes
            if (!isUpdate || movie.Episodes.Count == 0)
            {
                await ProcessEpisodesAsync(movie, apiResponse.Episodes);
            }

            // Xử lý các entities liên quan
            await ProcessRelatedEntitiesAsync(movie, item);

            // Xử lý TMDB và IMDb Info
            await ProcessTMDBInfoAsync(movie, item);
            await ProcessIMDbInfoAsync(movie, item);

            // Lưu thay đổi
            await _context.SaveChangesAsync().ConfigureAwait(false);
            await transaction.CommitAsync();

            string action = isUpdate ? "updated" : "added";
            return Result.Success($"Successfully {action} movie: {movie.Name} with {movie.Episodes.Count} episodes");
        }
        catch (Exception ex)
        {
            if (transaction != null)
            {
                await transaction.RollbackAsync();
            }
            return Result.Failure(new Error("LEECH_ERROR", $"Error processing movie: {ex.Message}"));
        }
        finally
        {
            transaction?.Dispose();
        }
    }
    private void UpdateMovieProperties(Movie movie, MovieDetailResponse item)
    {
        movie.Name = item.Name;
        movie.Slug = item.Slug;
        movie.OriginName = item.OriginName;
        movie.Content = item.Content;
        movie.PosterUrl = item.PosterUrl;
        movie.ThumbUrl = item.ThumbUrl;
        movie.TrailerUrl = item.TrailerUrl;
        movie.Time = item.Time;
        movie.EpisodeCurrent = item.EpisodeCurrent;
        movie.EpisodeTotal = ParseToInt(item.EpisodeTotal);
        movie.Quality = item.Quality;
        movie.Lang = item.Lang;
        movie.Status = item.Status;
        movie.Type = item.Type;
        movie.Notify = item.Notify;
        movie.Showtimes = item.Showtimes;
        movie.Year = item.Year;
        movie.View = item.View;
        movie.IsCopyright = item.IsCopyright;
        movie.SubDocquyen = item.SubDocquyen;
        movie.ChieuRap = item.ChieuRap;
        movie.CreatedAt = ParseToDateTimeUtc(item.Created?.Time) ?? DateTime.UtcNow;
        movie.ModifiedAt = ParseToDateTimeUtc(item.Modified?.Time) ?? DateTime.UtcNow;
    }
    private async Task DeleteExistingRelationshipsAsync(string movieId)
    {
        // Xóa các relationship cũ một cách hiệu quả
        await _context.Database.ExecuteSqlRawAsync(
            "DELETE FROM MovieCategories WHERE MovieId = {0}", movieId);
        await _context.Database.ExecuteSqlRawAsync(
            "DELETE FROM MovieCountries WHERE MovieId = {0}", movieId);
        await _context.Database.ExecuteSqlRawAsync(
            "DELETE FROM MovieActors WHERE MovieId = {0}", movieId);
        await _context.Database.ExecuteSqlRawAsync(
            "DELETE FROM MovieDirectors WHERE MovieId = {0}", movieId);
        await _context.Database.ExecuteSqlRawAsync(
            "DELETE FROM Episodes WHERE MovieId = {0}", movieId);
    }

    private async Task ProcessEpisodesAsync(Movie movie, List<EpisodeServerResponse> episodes)
    {
        if (episodes == null || !episodes.Any()) return;

        var episodeList = new List<Episode>();

        foreach (var episodeServer in episodes)
        {
            if (episodeServer.ServerData == null || !episodeServer.ServerData.Any())
                continue;

            foreach (var ep in episodeServer.ServerData)
            {
                episodeList.Add(new Episode
                {
                    MovieId = movie.Id,
                    ServerName = episodeServer.ServerName,
                    EpisodeName = ep.Name,
                    Slug = ep.Slug,
                    Filename = ep.Filename,
                    LinkEmbed = ep.LinkEmbed,
                    LinkM3U8 = ep.LinkM3u8
                });
            }
        }

        // Clear existing episodes and add new ones
        movie.Episodes.Clear();
        foreach (var episode in episodeList)
        {
            movie.Episodes.Add(episode);
        }
    }

    private async Task ProcessRelatedEntitiesAsync(Movie movie, MovieDetailResponse item)
    {
        // Xử lý Categories
        await ProcessCategoriesAsync(movie, item.Category);

        // Xử lý Countries  
        await ProcessCountriesAsync(movie, item.Country);

        // Xử lý Actors
        var actorNames = item.Actor?.Where(a => !string.IsNullOrWhiteSpace(a))
            .Select(a => a.Trim())
            .Distinct()
            .ToList() ?? new List<string>();
        await ProcessActorsAsync(movie, actorNames);

        // Xử lý Directors
        var directorNames = item.Director?.Where(d => !string.IsNullOrWhiteSpace(d) &&
                                                     d.Trim() != "Đang cập nhật")
            .Select(d => d.Trim())
            .Distinct()
            .ToList() ?? new List<string>();
        await ProcessDirectorsAsync(movie, directorNames);
    }

    private async Task ProcessCategoriesAsync(Movie movie, List<CategoryItemResponse> categories)
    {
        if (categories == null || !categories.Any()) return;

        // Lấy tất cả categories có trong database để tránh multiple queries
        var categoryIds = categories.Select(c => c.Id).ToList();
        var existingCategories = await _context.Categories
            .Where(c => categoryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c);

        foreach (var cat in categories)
        {
            if (string.IsNullOrWhiteSpace(cat.Id)) continue;

            Category category;
            if (existingCategories.TryGetValue(cat.Id, out var existingCategory))
            {
                category = existingCategory;
                // Cập nhật thông tin nếu cần
                if (category.Name != cat.Name || category.Slug != cat.Slug)
                {
                    category.Name = cat.Name;
                    category.Slug = cat.Slug;
                }
            }
            else
            {
                category = new Category
                {
                    Id = cat.Id,
                    Name = cat.Name,
                    Slug = cat.Slug
                };
                _context.Categories.Add(category);
                existingCategories[cat.Id] = category;
            }

            movie.MovieCategories.Add(new MovieCategory
            {
                MovieId = movie.Id,
                CategoryId = category.Id,
                Movie = movie,
                Category = category,
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    private async Task ProcessCountriesAsync(Movie movie, List<CountryItemResponse> countries)
    {
        if (countries == null || !countries.Any()) return;

        // Lấy tất cả countries có trong database để tránh multiple queries
        var countryIds = countries.Select(c => c.Id).ToList();
        var existingCountries = await _context.Countries
            .Where(c => countryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c);

        foreach (var ct in countries)
        {
            if (string.IsNullOrWhiteSpace(ct.Id)) continue;

            Country country;
            if (existingCountries.TryGetValue(ct.Id, out var existingCountry))
            {
                country = existingCountry;
                // Cập nhật thông tin nếu cần
                if (country.Name != ct.Name || country.Slug != ct.Slug)
                {
                    country.Name = ct.Name;
                    country.Slug = ct.Slug;
                }
            }
            else
            {
                country = new Country
                {
                    Id = ct.Id,
                    Name = ct.Name,
                    Slug = ct.Slug
                };
                _context.Countries.Add(country);
                existingCountries[ct.Id] = country;
            }

            movie.MovieCountries.Add(new MovieCountry
            {
                MovieId = movie.Id,
                CountryId = country.Id,
                Movie = movie,
                Country = country,
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    private async Task ProcessActorsAsync(Movie movie, List<string> actorNames)
    {
        if (!actorNames.Any()) return;

        // Lấy tất cả actors có trong database để tránh multiple queries
        var existingActors = await _context.Actors
            .Where(a => actorNames.Contains(a.Name))
            .ToDictionaryAsync(a => a.Name, a => a);

        foreach (var name in actorNames)
        {
            Actor actor;
            if (existingActors.TryGetValue(name, out var existingActor))
            {
                actor = existingActor;
            }
            else
            {
                actor = new Actor { Name = name };
                _context.Actors.Add(actor);
                existingActors[name] = actor;
            }

            movie.MovieActors.Add(new MovieActor
            {
                MovieId = movie.Id,
                ActorId = actor.Id,
                Movie = movie,
                Actor = actor
            });
        }
    }

    private async Task ProcessDirectorsAsync(Movie movie, List<string> directorNames)
    {
        if (!directorNames.Any()) return;

        // Lấy tất cả directors có trong database để tránh multiple queries
        var existingDirectors = await _context.Directors
            .Where(d => directorNames.Contains(d.Name))
            .ToDictionaryAsync(d => d.Name, d => d);

        foreach (var name in directorNames)
        {
            Director director;
            if (existingDirectors.TryGetValue(name, out var existingDirector))
            {
                director = existingDirector;
            }
            else
            {
                director = new Director { Name = name };
                _context.Directors.Add(director);
                existingDirectors[name] = director;
            }

            movie.MovieDirectors.Add(new MovieDirector
            {
                MovieId = movie.Id,
                DirectorId = director.Id,
                Movie = movie,
                Director = director
            });
        }
    }

    private async Task ProcessTMDBInfoAsync(Movie movie, MovieDetailResponse item)
    {
        if (item.Tmdb == null) return;

        // Kiểm tra xem đã có TMDBInfo chưa
        var existingTMDBInfo = await _context.Set<TMDBInfo>()
            .FirstOrDefaultAsync(t => t.MovieId == movie.Id);

        if (existingTMDBInfo != null)
        {
            // Cập nhật thông tin existing
            existingTMDBInfo.Type = item.Tmdb.Type;
            existingTMDBInfo.TMDBId = item.Tmdb.Id;
            existingTMDBInfo.Season = item.Tmdb.Season;
            existingTMDBInfo.VoteAverage = (float)item.Tmdb.VoteAverage;
            existingTMDBInfo.VoteCount = item.Tmdb.VoteCount;
            movie.TMDBInfo = existingTMDBInfo;
        }
        else
        {
            movie.TMDBInfo = new TMDBInfo
            {
                MovieId = movie.Id,
                Type = item.Tmdb.Type,
                TMDBId = item.Tmdb.Id,
                Season = item.Tmdb.Season,
                VoteAverage = (float)item.Tmdb.VoteAverage,
                VoteCount = item.Tmdb.VoteCount
            };
        }
    }

    private async Task ProcessIMDbInfoAsync(Movie movie, MovieDetailResponse item)
    {
        if (item.Imdb == null) return;

        // Kiểm tra xem đã có IMDbInfo chưa
        var existingIMDbInfo = await _context.Set<IMDbInfo>()
            .FirstOrDefaultAsync(i => i.MovieId == movie.Id);

        if (!string.IsNullOrEmpty(item.Imdb.Id))
        {
            if (existingIMDbInfo != null)
            {
                existingIMDbInfo.IMDbId = item.Imdb.Id;
                movie.IMDbInfo = existingIMDbInfo;
            }
            else
            {
                movie.IMDbInfo = new IMDbInfo
                {
                    MovieId = movie.Id,
                    IMDbId = item.Imdb.Id
                };
            }
        }
        else if (existingIMDbInfo != null)
        {
            // Xóa IMDbInfo nếu không có id
            _context.Set<IMDbInfo>().Remove(existingIMDbInfo);
            movie.IMDbInfo = null;
        }
    }

    private int? ParseToInt(object value)
    {
        if (value == null) return null;
        return int.TryParse(value.ToString(), out var result) ? result : null;
    }

    private DateTime? ParseToDateTimeUtc(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;

        if (DateTime.TryParse(value, out var result))
        {
            return result.Kind switch
            {
                DateTimeKind.Unspecified => DateTime.SpecifyKind(result, DateTimeKind.Utc),
                DateTimeKind.Local => result.ToUniversalTime(),
                _ => result
            };
        }

        return null;
    }

    public async Task<Result> GetAllMoviesAsync(GetAllMoviesRequest request)
    {
        try
        {
            // Validate request
            if (request.Page < 1) request.Page = 1;
            if (request.PageSize < 1 || request.PageSize > 100) request.PageSize = 10;

            // Build query
            var query = _context.Movies
                .Include(m => m.TMDBInfo)
                .Include(m => m.IMDbInfo)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .Include(m => m.MovieCategories)
                    .ThenInclude(mc => mc.Category)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(m => m.Name.Contains(request.Search) ||
                                       m.OriginName.Contains(request.Search));
            }

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                query = query.Where(m => m.MovieCategories.Any(mc => mc.Category.Slug == request.Category));
            }

            if (!string.IsNullOrWhiteSpace(request.Country))
            {
                query = query.Where(m => m.MovieCountries.Any(mc => mc.Country.Slug == request.Country));
            }

            if (request.Year.HasValue)
            {
                query = query.Where(m => m.Year == request.Year.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Type))
            {
                query = query.Where(m => m.Type == request.Type);
            }
            if (!string.IsNullOrWhiteSpace(request.Slug))
            {
                query = query.Where(m => m.Slug == request.Slug);
            }
            if (!string.IsNullOrWhiteSpace(request.Id))
            {
                query = query.Where(m => m.Id == request.Id);
            }
            // Apply sorting
            query = request.SortBy?.ToLower() switch
            {
                "name" => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(m => m.Name)
                    : query.OrderByDescending(m => m.Name),
                "year" => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(m => m.Year)
                    : query.OrderByDescending(m => m.Year),
                "view" => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(m => m.View)
                    : query.OrderByDescending(m => m.View),
                "modified" or _ => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(m => m.ModifiedAt)
                    : query.OrderByDescending(m => m.ModifiedAt)
            };

            // Get total count
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            var movieData = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(m => new
            {
                m.Id,
                m.Name,
                m.Slug,
                m.OriginName,
                m.PosterUrl,
                m.ThumbUrl,
                m.Year,
                m.EpisodeTotal,
                m.ModifiedAt,
                TMDBInfo = m.TMDBInfo != null ? new
                {
                    m.TMDBInfo.Type,
                    TMDBId = m.TMDBInfo.TMDBId,
                    m.TMDBInfo.Season,
                    m.TMDBInfo.VoteAverage,
                    m.TMDBInfo.VoteCount
                } : null,
                IMDbInfo = m.IMDbInfo != null ? new
                {
                    IMDbId = m.IMDbInfo.IMDbId
                } : null,
                Actors = m.MovieActors.Select(ma => new
                {
                    ma.Actor.Id,
                    ma.Actor.Name
                }),
                Categories = m.MovieCategories.Select(mc => new
                {
                    mc.Category.Id,
                    mc.Category.Name,
                    mc.Category.Slug
                })
                .ToList()
            })
            .ToListAsync();
            // Get paged results
            var movies = movieData.Select(m => new MovieItemResponse
            {
                Id = m.Id,
                Name = m.Name,
                Slug = m.Slug,
                OriginName = m.OriginName,
                PosterUrl = m.PosterUrl,
                ThumbUrl = m.ThumbUrl,
                Year = (int)m.Year,
                EpisodeTotal = (int)m.EpisodeTotal,
                Tmdb = m.TMDBInfo != null ? new TmdbResponse
                {
                    Type = m.TMDBInfo.Type,
                    Id = m.TMDBInfo.TMDBId,
                    Season = m.TMDBInfo.Season,
                    VoteAverage = m.TMDBInfo.VoteAverage,
                    VoteCount = m.TMDBInfo.VoteCount
                } : null,
                Imdb = m.IMDbInfo != null ? new ImdbResponse
                {
                    Id = m.IMDbInfo.IMDbId
                } : new ImdbResponse { Id = null },
                Modified = new TimeResponse
                {
                    Time = m.ModifiedAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                },
                Actor = m.Actors.Select(a => new ActorResponse
                {
                    Id = a.Id,
                    Name = a.Name
                }).ToList(),
                Category = m.Categories.Select(c => new CategoryItemResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug
                }).ToList()
            }).ToList();

            var response = new GetAllMoviesResponse
            {
                Status = true,
                Msg = "done",
                Items = movies,
                Pagination = new PaginationResponse
                {
                    TotalItems = totalItems,
                    TotalItemsPerPage = request.PageSize,
                    CurrentPage = request.Page,
                    TotalPages = totalPages
                }
            };

            return Result.Success(response);
        }
        catch (Exception ex)
        {
            return Result.Failure(new Error("Error", ex.Message));
        }
    }
}