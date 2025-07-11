using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using moiphim.Common.Errors;
using moiphim.DataAccess.Entities;
using moiphim.Entities;
using moiphim.Services.Models.RequestModels.User;
using moiphim.Services.Models.ResponseModels.User;
using moiphim.Services.Results;
using moiphim.Services.Services.Interfaces;
using Newtonsoft.Json;

namespace moiphim.Services.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly moiphimDbContext _context;
        private readonly IConfiguration _configuration;

        public UserService(ILogger<UserService> logger, moiphimDbContext context, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
        }
        public async Task<Result> RegisterUser(RegisterModelRequest model)
        {
            _logger.LogInformation("Executing method: {MethodName}, Email: {Email}",
                $"{nameof(UserService)}.{nameof(RegisterUser)}", model.Email);
            if (_context.Users.Any(u => u.Email.ToLower() == model.Email.ToLower()))
            {
                return Result.Failure(Error.None);
            }
            var user = new User
            {
                Email = model.Email,
                UserName = model.UserName,
                PasswordHash = HashPassword(model.Password),
                RegisterDate = DateTime.UtcNow,
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Method: {MethodName} completed, Result: {Result}",
                    $"{nameof(UserService)}.{nameof(RegisterUser)}",
                    JsonConvert.SerializeObject(user));

            return Result.Success(user.Email);
        }

        public async Task<Result> Login(LoginModelRequest model)
        {
            _logger.LogInformation("Executing method: {MethodName}, UserName: {UserName}",
            $"{nameof(UserService)}.{nameof(Login)}", model.UserName);
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email.ToLower() == model.UserName.ToLower());
            if (user == null || HashPassword(model.Password) != user.PasswordHash)
            {
                return Result.Failure(UserErrors.InvalidCredentials);
            }
            if (!user.IsActive)
            {
                return Result.Failure(UserErrors.Deactivated);
            }
            if (user.RegisterDate.AddDays(30) < DateTime.UtcNow && user.IsActive)
            {
                user.IsActive = false;
                await _context.SaveChangesAsync();
                return Result.Failure(UserErrors.Deactivated);
            }
            var token = GenerateJwtToken(user);
            var userId = user.UserId;
            _logger.LogInformation("Method: {MethodName} completed, Result: {Result}",
                $"{nameof(UserService)}.{nameof(RegisterUser)}",
                JsonConvert.SerializeObject(user));
            return Result.Success(token);
        }

        private static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashedBytes = sha256.ComputeHash(passwordBytes);
                return Convert.ToBase64String(hashedBytes);
            }
        }
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("email", user.Email)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiredTime = user.RegisterDate.AddDays(30) - DateTime.UtcNow;
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.Add(expiredTime),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<Result> GetAllUsers()
        {
            var users = await _context.Users.Select(u => new User
            {
                UserId = u.UserId,
                UserName = u.UserName,
                Email = u.Email,
                PasswordHash = u.PasswordHash,
                RegisterDate = u.RegisterDate,
                IsActive = u.IsActive,
                AvatarUrl = u.AvatarUrl,
                Role = u.Role
            }).OrderByDescending(u => u.RegisterDate).ToListAsync();
            return Result.Success(users);
        }

        public async Task<Result> GetUserByUserName(string name)
        {
            var user = await _context.Users.Where(u => u.UserName == name)
                .Select(u => new UserResponseModel
            {
                UserId = u.UserId,
                UserName = u.UserName,
                Email = u.Email,
                RegisterDate = u.RegisterDate,
                IsActive = u.IsActive,
                AvatarUrl = u.AvatarUrl,
                Role = u.Role
            }).FirstOrDefaultAsync();
            if (user == null)
            {
                return Result.Failure(Error.NullValue);
            }
            return Result.Success(user);
        }
        public async Task<Result> CreateUser(CreateUserRequest request)
        {
            try
            {
                if(string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Role))
                {
                    return Result.Failure(Error.None);
                }
                var existingUser = await _context.Users.Where(u => (u.UserName == request.UserName || u.Email == request.Email)).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    return Result.Failure(Error.None);
                }
                var user = new User
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    PasswordHash = HashPassword(request.Password),
                    RegisterDate = DateTime.UtcNow
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Result.Success(user);
            } catch (Exception ex)
            {
                return Result.Failure(Error.NullValue);
            }
        }
        public async Task<Result> UpdateUserById(UpdateUserRequest request, Guid id)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
                if (user == null)
                {
                    return Result.Failure(Error.NullValue);
                }

                // Kiểm tra username hoặc email đã tồn tại với user khác
                var existingUser = await _context.Users
                    .Where(u => u.UserId != id && (u.UserName == request.UserName || u.Email == request.UserEmail))
                    .FirstOrDefaultAsync();

                if (existingUser != null)
                {
                    return Result.Failure(Error.NullValue);
                }

                // Chỉ update những field không null/empty
                if (!string.IsNullOrEmpty(request.UserName))
                    user.UserName = request.UserName;

                if (!string.IsNullOrEmpty(request.UserEmail))
                    user.Email = request.UserEmail;

                if (!string.IsNullOrEmpty(request.Password))
                    user.PasswordHash = HashPassword(request.Password);

                //if (request.Role.HasValue)
                //    user.Role = request.Role.Value;

                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Result.Success(user);
            }
            catch (Exception ex)
            {
                return Result.Failure(Error.NullValue);
            }
        }
        public async Task<Result> DeleteUserById(Guid id)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
                if (user == null)
                {
                    return Result.Failure(Error.NullValue);
                }
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Result.Success(true);
            } catch (Exception ex)
            {
                return Result.Failure(Error.NullValue);
            }
        }
        public async Task<Result> ChangePassword(ChangePasswordModelRequest model)
        {
            try
            {
                var user = await _context.Users.FindAsync(model.UserId);
                if (user == null)
                {
                    return Result.Failure(Error.NullValue);
                }
                if (!VerifyPassword(model.OldPassword, user.PasswordHash))
                {
                    return Result.Failure(Error.NullValue);
                }
                user.PasswordHash = HashPassword(model.NewPassword);
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Result.Success(user);
            } catch (Exception ex)
            {
                return Result.Failure(Error.NullValue);
            }
        }
        private bool VerifyPassword(string plainPassword, string hashedPassword)
        {
            return HashPassword(plainPassword) == hashedPassword;
        }
    }
}
