import { Container, Typography, Box, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BilingualText } from '@/types';
import membersData from '@/constants/members.json';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: { 
    locale: string;
    memberId: string;
  };
}

// Generate static params for all members
export async function generateStaticParams() {
  const memberIds = Object.keys(membersData.members);
  
  return memberIds.map((memberId) => ({
    memberId,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, memberId } = params;
  const member = membersData.members[memberId as keyof typeof membersData.members];
  
  if (!member) {
    return {
      title: 'Miembro no encontrado',
    };
  }

  const biography = member.biography[locale as 'es' | 'en'] || member.biography.es;
  
  return {
    title: `${member.name} - Miembros Megadeth`,
    description: biography.substring(0, 150) + '...',
    openGraph: {
      title: `${member.name} - Megadeth`,
      description: biography.substring(0, 150) + '...',
      images: [member.image],
    },
  };
}

export default function MemberDetailPage({ params }: PageProps) {
  const { locale, memberId } = params;
  const t = useTranslations('lineups');
  const currentLocale = locale as 'es' | 'en';
  
  const member = membersData.members[memberId as keyof typeof membersData.members];
  
  if (!member) {
    notFound();
  }

  const getLocalizedText = (text: BilingualText): string => {
    return text[currentLocale] || text.es;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Image
              src={member.image}
              alt={member.name}
              width={300}
              height={300}
              style={{ 
                borderRadius: '12px',
                width: '100%',
                height: 'auto',
                maxWidth: '300px'
              }}
            />
          </Box>
        </Grid>
        
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>
            <Typography variant="h1" component="h1" gutterBottom>
              {member.name}
            </Typography>
            
            <Typography variant="h4" color="text.secondary" gutterBottom>
              {getLocalizedText(member.fullName)}
            </Typography>
            
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              &ldquo;{getLocalizedText(member.nickname)}&rdquo;
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip 
                label={getLocalizedText(member.period)} 
                color="primary" 
                variant="filled"
              />
              <Chip 
                label={getLocalizedText(member.role)} 
                color="secondary" 
                variant="outlined"
              />
              <Chip 
                label={getLocalizedText(member.country)} 
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              {getLocalizedText(member.biography)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Details Cards */}
      <Grid container spacing={4}>
        {/* Instruments & Role */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {t('member.instruments')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {member.instruments[currentLocale]?.map((instrument, index) => (
                  <Chip 
                    key={index}
                    label={instrument} 
                    color="primary"
                    variant="outlined"
                  />
                )) || member.instruments.es?.map((instrument, index) => (
                  <Chip 
                    key={index}
                    label={instrument} 
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                {t('member.period')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {getLocalizedText(member.period)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Información Personal
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  {t('member.birthYear')}
                </Typography>
                <Typography variant="body1">
                  {member.birthYear}
                </Typography>
              </Box>
              
              {'deathYear' in member && member.deathYear && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    {t('member.deathYear')}
                  </Typography>
                  <Typography variant="body1">
                    {member.deathYear}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  {t('member.country')}
                </Typography>
                <Typography variant="body1">
                  {getLocalizedText(member.country)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Albums */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {t('member.albums')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {member.albums.map((album, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    • {album}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Other Projects */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {t('member.otherProjects')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {member.otherProjects[currentLocale]?.map((project, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    • {project}
                  </Typography>
                )) || member.otherProjects.es?.map((project, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    • {project}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}