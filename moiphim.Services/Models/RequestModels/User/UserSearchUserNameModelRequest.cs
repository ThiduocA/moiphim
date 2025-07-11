using Microsoft.AspNetCore.Mvc;

namespace moiphim.Services.Models.RequestModels.User;

public class UserSearchUserNameModelRequest
{
    [FromRoute(Name = "UserName")]
    public string UserName { get; set; } = string.Empty;
}
