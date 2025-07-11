namespace moiphim.Services.Models.RequestModels.Movies;

public class GetAllMoviesRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? Category { get; set; }
    public string? Country { get; set; }
    public int? Year { get; set; }
    public string? Type { get; set; }
    public string? SortBy { get; set; } = "modified"; // modified, name, year, view
    public string? SortOrder { get; set; } = "desc"; // asc, desc
}
