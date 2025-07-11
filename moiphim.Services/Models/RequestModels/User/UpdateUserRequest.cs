

namespace moiphim.Services.Models.RequestModels.User;

public class UpdateUserRequest
{
    public string UserName { get; set; }
    public string UserEmail { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
