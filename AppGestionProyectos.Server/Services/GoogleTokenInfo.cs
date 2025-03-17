namespace AppGestionProyectos.Server.Services
{
    public class GoogleTokenInfo
    {
        public string? azp { get; set; } // Authorized party (cliente autorizado)
        public string? aud { get; set; } // Audience (ID del cliente)
        public string? sub { get; set; } // Subject (identificador único del usuario)
        public string? scope { get; set; } // Alcances asociados al token
        public string? exp { get; set; } // Fecha de expiración en formato UNIX timestamp
        public string? expires_in { get; set; } // Tiempo restante antes de que expire el token
        public string? email { get; set; } // Correo electrónico del usuario
        public string? email_verified { get; set; } // Si el correo está verificado
        public string? access_type { get; set; } // Tipo de acceso (online/offline)
        public string? error { get; set; }
    }
}
