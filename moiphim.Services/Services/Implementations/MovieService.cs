using Microsoft.EntityFrameworkCore;
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

        // Cấu hình chỉ một lần và kiểm tra để tránh duplicate headers
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
        try
        {
            var response = await _httpClient.GetAsync(apiUrl).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            // Sử dụng System.Text.Json thay vì Newtonsoft.Json (nhanh hơn)
            var apiResponse = JsonSerializer.Deserialize<ApiResponseModel>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (apiResponse?.Status != true || apiResponse.Movie == null)
            {
                return Result.Failure(new Error("API_ERROR", "API returned unsuccessful response or no movie data"));
            }

            var item = apiResponse.Movie;
            string movieId = item._id;

            // Kiểm tra movie tồn tại
            if (await _context.Movies.AsNoTracking()
                .AnyAsync(m => m.Id == movieId).ConfigureAwait(false))
            {
                return Result.Success($"Movie {item.name} already exists");
            }

            // Tạo movie object
            var movie = new Movie
            {
                Id = movieId,
                Name = item.name,
                Slug = item.slug,
                OriginName = item.origin_name,
                Content = item.content,
                PosterUrl = item.poster_url,
                ThumbUrl = item.thumb_url,
                TrailerUrl = item.trailer_url,
                Time = item.time,
                EpisodeCurrent = item.episode_current,
                EpisodeTotal = ParseToInt(item.episode_total),
                Quality = item.quality,
                Lang = item.lang,
                Status = item.status,
                Type = item.type,
                Notify = item.notify,
                Showtimes = item.showtimes,
                Year = item.year,
                View = item.view,
                IsCopyright = item.is_copyright,
                SubDocquyen = item.sub_docquyen,
                ChieuRap = item.chieurap,
                CreatedAt = ParseToDateTimeUtc(item.created?.time),
                ModifiedAt = ParseToDateTimeUtc(item.modified?.time),
                Episodes = new List<Episode>(),
                MovieCategories = new List<MovieCategory>(),
                MovieCountries = new List<MovieCountry>(),
                MovieActors = new List<MovieActor>(),
                MovieDirectors = new List<MovieDirector>()
            };

            // Xử lý Episodes
            await ProcessEpisodesAsync(movie, apiResponse.Episodes);

            // Xử lý các entities song song để tối ưu hiệu suất
            await ProcessRelatedEntitiesAsync(movie, item);

            // Xử lý TMDB và IMDb Info
            ProcessTMDBInfo(movie, item);
            ProcessIMDbInfo(movie, item);

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Result.Success($"Successfully added movie: {movie.Name} with {movie.Episodes.Count} episodes");
        }
        catch (Exception ex)
        {
            return Result.Failure(new Error("Error", ex.ToString()));
        }
    }

    private async Task ProcessEpisodesAsync(Movie movie, List<EpisodeServerModel> episodes)
    {
        if (episodes == null) return;

        foreach (var episodeServer in episodes)
        {
            if (episodeServer.server_data == null) continue;

            foreach (var ep in episodeServer.server_data)
            {
                movie.Episodes.Add(new Episode
                {
                    ServerName = episodeServer.server_name,
                    EpisodeName = ep.name,
                    Slug = ep.slug,
                    Filename = ep.filename,
                    LinkEmbed = ep.link_embed,
                    LinkM3U8 = ep.link_m3u8
                });
            }
        }
    }

    private async Task ProcessRelatedEntitiesAsync(Movie movie, MovieItemModel item)
    {
        // Xử lý Categories
        await ProcessCategoriesAsync(movie, item.category);

        // Xử lý Countries
        await ProcessCountriesAsync(movie, item.country);

        // Xử lý Actors
        var actorNames = item.actor?.Select(a => a?.ToString())
            .Where(n => !string.IsNullOrEmpty(n))
            .ToList() ?? new List<string>();
        await ProcessActorsAsync(movie, actorNames);

        // Xử lý Directors
        var directorNames = item.director?.Select(d => d?.ToString())
            .Where(n => !string.IsNullOrEmpty(n) && n != "Đang cập nhật")
            .ToList() ?? new List<string>();
        await ProcessDirectorsAsync(movie, directorNames);
    }

    private async Task ProcessCategoriesAsync(Movie movie, List<CategoryModel> categories)
    {
        if (categories == null) return;

        foreach (var cat in categories)
        {
            Category category = await _context.Categories.FindAsync(cat.id);

            if (category == null)
            {
                category = new Category { Id = cat.id, Name = cat.name, Slug = cat.slug };
                _context.Categories.Add(category);
            }
            else
            {
                // Update existing
                category.Name = cat.name;
                category.Slug = cat.slug;
            }

            movie.MovieCategories.Add(new MovieCategory { Movie = movie, Category = category });
        }
    }

    private async Task ProcessCountriesAsync(Movie movie, List<CountryModel> countries)
    {
        if (countries == null) return;

        foreach (var ct in countries)
        {
            Country country = await _context.Countries.FindAsync(ct.id);

            if (country == null)
            {
                country = new Country { Id = ct.id, Name = ct.name, Slug = ct.slug };
                _context.Countries.Add(country);
            }
            else
            {
                // Update existing
                country.Name = ct.name;
                country.Slug = ct.slug;
            }

            movie.MovieCountries.Add(new MovieCountry { Movie = movie, Country = country });
        }
    }

    private async Task ProcessActorsAsync(Movie movie, List<string> actorNames)
    {
        foreach (var name in actorNames)
        {
            // Tìm actor theo name (không phải ID)
            Actor actor = await _context.Actors.FirstOrDefaultAsync(a => a.Name == name);

            if (actor == null)
            {
                actor = new Actor { Name = name };
                _context.Actors.Add(actor);
            }
            // Không cần update vì Actor chỉ có Name

            movie.MovieActors.Add(new MovieActor { Movie = movie, Actor = actor });
        }
    }

    private async Task ProcessDirectorsAsync(Movie movie, List<string> directorNames)
    {
        foreach (var name in directorNames)
        {
            // Tìm director theo name (không phải ID)
            Director director = await _context.Directors.FirstOrDefaultAsync(d => d.Name == name);

            if (director == null)
            {
                director = new Director { Name = name };
                _context.Directors.Add(director);
            }
            // Không cần update vì Director chỉ có Name

            movie.MovieDirectors.Add(new MovieDirector { Movie = movie, Director = director });
        }
    }

    private void ProcessTMDBInfo(Movie movie, MovieItemModel item)
    {
        if (item.tmdb != null)
        {
            movie.TMDBInfo = new TMDBInfo
            {
                MovieId = movie.Id,
                Type = item.tmdb.type,
                TMDBId = item.tmdb.id,
                Season = item.tmdb.season,
                VoteAverage = (float)item.tmdb.vote_average,
                VoteCount = item.tmdb.vote_count
            };
        }
    }

    private void ProcessIMDbInfo(Movie movie, MovieItemModel item)
    {
        if (item.imdb != null && !string.IsNullOrEmpty(item.imdb.id))
        {
            movie.IMDbInfo = new IMDbInfo
            {
                MovieId = movie.Id,
                IMDbId = item.imdb.id
            };
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
                } : null
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
                }
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