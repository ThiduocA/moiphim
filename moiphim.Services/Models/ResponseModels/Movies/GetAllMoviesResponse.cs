using System.Text.Json.Serialization;

namespace moiphim.Services.Models.ResponseModels.Movies;

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

    [JsonPropertyName("tmdb")]
    public TmdbResponse Tmdb { get; set; }

    [JsonPropertyName("imdb")]
    public ImdbResponse Imdb { get; set; }

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