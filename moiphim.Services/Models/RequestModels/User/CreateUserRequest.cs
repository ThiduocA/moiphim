

namespace moiphim.Services.Models.RequestModels.User;

public class CreateUserRequest
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
