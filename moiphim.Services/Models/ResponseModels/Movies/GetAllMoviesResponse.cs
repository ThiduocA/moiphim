using System.Text.Json.Serialization;

namespace moiphim.Services.Models.ResponseModels.Movies;

public class GetMovieDetailResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("msg")]
    public string Msg { get; set; }

    [JsonPropertyName("movie")]
    public MovieDetailResponse Movie { get; set; }

    [JsonPropertyName("episodes")]
    public List<EpisodeServerResponse> Episodes { get; set; }
}
public class MovieDetailResponse
{
    [JsonPropertyName("_id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("slug")]
    public string Slug { get; set; }

    [JsonPropertyName("origin_name")]
    public string OriginName { get; set; }

    [JsonPropertyName("content")]
    public string Content { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; }

    [JsonPropertyName("poster_url")]
    public string PosterUrl { get; set; }

    [JsonPropertyName("thumb_url")]
    public string ThumbUrl { get; set; }

    [JsonPropertyName("trailer_url")]
    public string TrailerUrl { get; set; }

    [JsonPropertyName("time")]
    public string Time { get; set; }

    [JsonPropertyName("episode_current")]
    public string EpisodeCurrent { get; set; }

    [JsonPropertyName("episode_total")]
    public string EpisodeTotal { get; set; }

    [JsonPropertyName("quality")]
    public string Quality { get; set; }

    [JsonPropertyName("lang")]
    public string Lang { get; set; }

    [JsonPropertyName("notify")]
    public string Notify { get; set; }

    [JsonPropertyName("showtimes")]
    public string Showtimes { get; set; }

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("view")]
    public int View { get; set; }

    [JsonPropertyName("is_copyright")]
    public bool IsCopyright { get; set; }

    [JsonPropertyName("sub_docquyen")]
    public bool SubDocquyen { get; set; }

    [JsonPropertyName("chieurap")]
    public bool ChieuRap { get; set; }

    [JsonPropertyName("category")]
    public List<CategoryItemResponse> Category { get; set; }

    [JsonPropertyName("country")]
    public List<CountryItemResponse> Country { get; set; }

    [JsonPropertyName("actor")]
    public List<string> Actor { get; set; }

    [JsonPropertyName("director")]
    public List<string> Director { get; set; }

    [JsonPropertyName("tmdb")]
    public TmdbResponse Tmdb { get; set; }

    [JsonPropertyName("imdb")]
    public ImdbResponse Imdb { get; set; }

    [JsonPropertyName("created")]
    public TimeResponse Created { get; set; }

    [JsonPropertyName("modified")]
    public TimeResponse Modified { get; set; }
}

public class TmdbResponse
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("season")]
    public int? Season { get; set; }

    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; set; }

    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }
}

public class ImdbResponse
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
}

public class TimeResponse
{
    [JsonPropertyName("time")]
    public string? Time { get; set; }
}

public class PaginationResponse
{
    [JsonPropertyName("totalItems")]
    public int TotalItems { get; set; }

    [JsonPropertyName("totalItemsPerPage")]
    public int TotalItemsPerPage { get; set; }

    [JsonPropertyName("currentPage")]
    public int CurrentPage { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}
public class CategoryItemResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("slug")]
    public string Slug { get; set; }
}

public class CountryItemResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("slug")]
    public string Slug { get; set; }
}
public class EpisodeDataResponse
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("slug")]
    public string Slug { get; set; }

    [JsonPropertyName("filename")]
    public string Filename { get; set; }

    [JsonPropertyName("link_embed")]
    public string LinkEmbed { get; set; }

    [JsonPropertyName("link_m3u8")]
    public string LinkM3u8 { get; set; }
}
public class EpisodeServerResponse
{
    [JsonPropertyName("server_name")]
    public string ServerName { get; set; }

    [JsonPropertyName("server_data")]
    public List<EpisodeDataResponse> ServerData { get; set; }
}
public class GetAllMoviesResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }
    [JsonPropertyName("msg")]
    public string Msg { get; set; }
    [JsonPropertyName("items")]
    public List<MovieItemResponse> Items { get; set; }
    [JsonPropertyName("pagination")]
    public PaginationResponse Pagination { get; set; }
}
public class MovieItemResponse
{
    [JsonPropertyName("_id")]
    public string Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("slug")]
    public string Slug { get; set; }
    [JsonPropertyName("origin_name")]
    public string OriginName { get; set; }
    [JsonPropertyName("poster_url")]
    public string PosterUrl { get; set; }
    [JsonPropertyName("thumb_url")]
    public string ThumbUrl { get; set; }
    [JsonPropertyName("year")]
    public int Year { get; set; }
    [JsonPropertyName("episode_total")]
    public int EpisodeTotal { get; set; }
    [JsonPropertyName("tmdb")]
    public TmdbResponse Tmdb { get; set; }
    [JsonPropertyName("imdb")]
    public ImdbResponse Imdb { get; set; }
    [JsonPropertyName("modified")]
    public TimeResponse Modified { get; set; }
    [JsonPropertyName("actor")]
    public List<ActorResponse> Actor { get; set; }
    public List<CategoryItemResponse> Category { get; set; }
}
public class  ActorResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
}