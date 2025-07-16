using Microsoft.EntityFrameworkCore;
using moiphim.DataAccess.Entities;
using moiphim.Services.Results;
using moiphim.Services.Services.Interfaces;
using moiphim.Common.Errors;

namespace moiphim.Services.Services.Implementations;

public class EpisodeService : IEpisodeService
{
    private readonly moiphimDbContext _context;
    public EpisodeService(moiphimDbContext context)
    {
        _context = context;
    }
    public async Task<Result> GetEpisodeById(string movieId)
    {
        var episode = await _context.Episodes
            .Where(e => e.MovieId == movieId)
            .ToListAsync();
        if (episode == null || !episode.Any())
        {
            return Result.Failure(new Error("Not found", "Not found episode for this movie"));
        }
        return Result.Success(episode);
    }
}
