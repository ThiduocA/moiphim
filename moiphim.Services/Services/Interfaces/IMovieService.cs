using moiphim.Services.Results;
using moiphim.Services.Models.RequestModels.Movies;
namespace moiphim.Services.Services.Interfaces;

public interface IMovieService
{
    Task<Result> LeechMoviesAsync(string apiUrl);
    Task<Result> GetAllMoviesAsync(GetAllMoviesRequest request);
    Task<Result> GetAllCategoriesAsync();
}
