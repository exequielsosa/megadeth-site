import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useState } from "react";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [album, setAlbum] = useState({
    id: "",
    title: "",
    year: 0,
    cover: "",
    label: "",
  });
  const [news, setNews] = useState({
    id: "",
    title: "",
    date: "",
    content: "",
  });
  const [status, setStatus] = useState<string | null>(null);

  const submitAlbum = async () => {
    setStatus(null);
    const res = await fetch("/api/admin/discography", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(album),
    });
    setStatus(res.ok ? "Álbum guardado" : "Error al guardar álbum");
  };

  const submitNews = async () => {
    setStatus(null);
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(news),
    });
    setStatus(res.ok ? "Noticia guardada" : "Error al guardar noticia");
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontFamily: "var(--font-heading)" }}
      >
        Admin CMS
      </Typography>
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        Panel básico para actualizar discografía y noticias. Protegido con
        token.
      </Typography>

      <TextField
        label="Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        type="password"
      />

      <Grid container spacing={4}>
        <Grid key="album" size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontFamily: "var(--font-heading)", mb: 2 }}
              >
                Agregar Álbum
              </Typography>
              <Box sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="ID"
                  value={album.id}
                  onChange={(e) => setAlbum({ ...album, id: e.target.value })}
                />
                <TextField
                  label="Título"
                  value={album.title}
                  onChange={(e) =>
                    setAlbum({ ...album, title: e.target.value })
                  }
                />
                <TextField
                  label="Año"
                  type="number"
                  value={album.year}
                  onChange={(e) =>
                    setAlbum({ ...album, year: Number(e.target.value) })
                  }
                />
                <TextField
                  label="Cover URL"
                  value={album.cover}
                  onChange={(e) =>
                    setAlbum({ ...album, cover: e.target.value })
                  }
                />
                <TextField
                  label="Sello"
                  value={album.label}
                  onChange={(e) =>
                    setAlbum({ ...album, label: e.target.value })
                  }
                />
                <Button variant="contained" onClick={submitAlbum}>
                  Guardar Álbum
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid key="news" size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontFamily: "var(--font-heading)", mb: 2 }}
              >
                Agregar Noticia
              </Typography>
              <Box sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="ID"
                  value={news.id}
                  onChange={(e) => setNews({ ...news, id: e.target.value })}
                />
                <TextField
                  label="Título"
                  value={news.title}
                  onChange={(e) => setNews({ ...news, title: e.target.value })}
                />
                <TextField
                  label="Fecha (YYYY-MM-DD)"
                  value={news.date}
                  onChange={(e) => setNews({ ...news, date: e.target.value })}
                />
                <TextField
                  label="Contenido"
                  multiline
                  rows={5}
                  value={news.content}
                  onChange={(e) =>
                    setNews({ ...news, content: e.target.value })
                  }
                />
                <Button variant="contained" onClick={submitNews}>
                  Guardar Noticia
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {status && <Typography sx={{ mt: 3 }}>{status}</Typography>}
    </Container>
  );
}
