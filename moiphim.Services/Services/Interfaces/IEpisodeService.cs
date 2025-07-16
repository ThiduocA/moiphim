

using moiphim.Services.Results;

namespace moiphim.Services.Services.Interfaces;

public interface IEpisodeService
{
    Task<Result> GetEpisodeById(string movieId);
}
