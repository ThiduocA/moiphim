namespace moiphim.Services.Models.RequestModels.User;

public class LoginModelRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
