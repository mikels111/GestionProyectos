using Microsoft.AspNetCore.Identity;

namespace AppGestionProyectos.Server.Services
{
    public class PasswordService : IDisposable
    {
        private readonly PasswordHasher<string> _passwordHasher = new PasswordHasher<string>();

        public PasswordService()
        {

        }
        public void Dispose()
        {
        }

        public string HashPassword(string password)
        {
            return _passwordHasher.HashPassword(null, password);
        }

        public bool VerifyPassword(string hashedPassword, string inputPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, inputPassword);
            return result == PasswordVerificationResult.Success;
        }
    }
}
