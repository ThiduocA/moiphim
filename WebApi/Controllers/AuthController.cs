using Microsoft.AspNetCore.Mvc;
using moiphim.Services.Models.RequestModels.User;
using moiphim.Services.Services.Interfaces;
using moiphim.Services.Results;

namespace moiphim.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseController
{
    private readonly ILogger<AuthController> _logger;
    private IUserService _userService;
    
    public AuthController(ILogger<AuthController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModelRequest model)
    {
        _logger.LogInformation($"Executing: {nameof(AuthController)}.{nameof(Register)}");
        var result = await _userService.RegisterUser(model);

        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModelRequest model)
    {
        _logger.LogInformation($"Executing: {nameof(AuthController)}.{nameof(Login)}");
        var result = await _userService.Login(model);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }
}
