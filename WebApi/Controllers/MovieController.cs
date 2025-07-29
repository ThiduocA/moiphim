using moiphim.Services.Models.RequestModels.Movies;

namespace moiphim.WebApi.Controllers;
[ApiController]
[Route("api/[controller]")]
public class MovieController : BaseController
{
    private readonly IMovieService _movieService;
    private readonly IEpisodeService _episodeService;
    public MovieController(IMovieService movieService, IEpisodeService episodeService)
    {
        _movieService = movieService;
        _episodeService = episodeService;
    }
    [HttpPost("leech")]
    public async Task<IActionResult> Leech()
    {
        string apiUrl = "https://phimapi.com/phim/bo-ba-bat-hanh";
        var result = await _movieService.LeechMoviesAsync(apiUrl);
        return result.Match<IActionResult>(
           onSuccess: () => Ok(result),
           onFailure: error => BadRequest(error));
    }
    [HttpGet]
    public async Task<IActionResult> GetAllMovies([FromQuery] GetAllMoviesRequest request)
    {
        var result = await _movieService.GetAllMoviesAsync(request);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }
    [HttpGet("{id}/episodes")]
    public async Task<IActionResult> GetEpisodesByMovieId(string id)
    {
        var result = await _episodeService.GetEpisodeById(id);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => NotFound(error));
    }
    [HttpGet("categories")]
    public async Task<IActionResult> GetAllCategory()
    {
        var result = await _movieService.GetAllCategoriesAsync();
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }
}
