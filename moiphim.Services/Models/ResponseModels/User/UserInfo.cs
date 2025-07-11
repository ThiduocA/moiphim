
namespace moiphim.Services.Models.ResponseModels.User;

public class UserInfo
{
    public string UserId { get; set; } = null!;
    public string Email { get; set; } = null!;
    
    public UserInfo(string userId, string email)
    {
        UserId = userId; Email = email;
    }
}
