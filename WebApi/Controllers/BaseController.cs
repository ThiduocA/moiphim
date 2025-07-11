using Microsoft.AspNetCore.Mvc;
using moiphim.Services.Models.ResponseModels.User;

namespace moiphim.WebApi.Controllers;

public class BaseController : ControllerBase
{
    protected UserInfo UserInfo => GetPrincipleUser();

    private UserInfo GetPrincipleUser()
    {
        if (HttpContext.Items.TryGetValue("PRINCIPLE_USER", out var principleUser) && principleUser is UserInfo user)
        {
            return user;
        }

        throw new UnauthorizedAccessException("Unauthorized Access");
    }
}
