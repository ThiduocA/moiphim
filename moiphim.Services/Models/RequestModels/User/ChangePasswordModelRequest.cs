namespace moiphim.Services.Models.RequestModels.User;

public class ChangePasswordModelRequest
{
    public Guid UserId { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}
