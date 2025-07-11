using moiphim.Services.Models.RequestModels.Movies;

namespace moiphim.WebApi.Controllers;
[ApiController]
[Route("api/[controller]")]
public class MovieController : BaseController
{
    private readonly IMovieService _movieService;
    public MovieController(IMovieService movieService)
    {
        _movieService = movieService;
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

}
