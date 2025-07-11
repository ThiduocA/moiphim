using Microsoft.AspNetCore.Mvc;

namespace moiphim.Services.Models.RequestModels.User;

public class UserSearchIdModelRequest
{
    [FromRoute(Name = "UserId")]
    public string UserId { get; set; } = string.Empty;
}
