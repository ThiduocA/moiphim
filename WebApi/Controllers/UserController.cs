using moiphim.Services.Models.RequestModels.User;

namespace moiphim.WebApi.Controllers;
[ApiController]
[Route("api/[controller]")]

public class UserController : BaseController
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;
    public UserController(ILogger<UserController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }

    //GET: api/Users
    [HttpGet]
    public async Task<IActionResult> GetAllUser()
    {
        _logger.LogInformation($"Executing: {nameof(UserService)}.{nameof(GetAllUser)}");
        var result = await _userService.GetAllUsers();
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }
    //GET: api/Users/{userid}
    [HttpGet("{UserName}")]
    public async Task<IActionResult> GetUserByUserName([FromRoute] UserSearchUserNameModelRequest request)
    {
        _logger.LogInformation($"Executing: {nameof(UserService)}.{nameof(GetUserByUserName)}");
        var result = await _userService.GetUserByUserName(request.UserName);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }

    //PUT: api/User/{userid}
    [HttpPut("{UserId}")]
    public async Task<IActionResult> UpdateUserById([FromBody] UpdateUserRequest request, Guid UserId)
    {
        _logger.LogInformation($"Executing: {nameof(UserService)}.{nameof(UpdateUserById)}");
        var result = await _userService.UpdateUserById(request, UserId);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }


    [HttpDelete("{UserId}")]
    public async Task<IActionResult> DeleteUserById([FromRoute] Guid UserId)
    {
        _logger.LogInformation($"Executing: {nameof(UserService)}.{nameof(DeleteUserById)}");
        var result = await _userService.DeleteUserById(UserId);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }
    [HttpPost("changePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModelRequest request)
    {
        _logger.LogInformation($"Executing: {nameof(UserService)}.{nameof(ChangePassword)}");
        var result = await _userService.ChangePassword(request);
        return result.Match<IActionResult>(
            onSuccess: () => Ok(result),
            onFailure: error => BadRequest(error));
    }
}
