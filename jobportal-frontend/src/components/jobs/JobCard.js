import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link as RouterLink } from 'react-router-dom'; 

const JobCard = ({ job }) => {
  if (!job) {
    return null; 
  }

  
  const { 
    id,
    title = "No Title Provided", 
    companyName = "N/A", 
    location = "N/A", 
    description = "No description available.", 
    postedDate = "N/A" 
  } = job;

  const truncateDescription = (text, maxLength) => {
    if (typeof text !== 'string' || text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: 3, 
      transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
      '&:hover': { 
        boxShadow: 7,
        transform: 'translateY(-4px)' 
      } 
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" color="primary.main" sx={{fontWeight: 'bold'}}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <BusinessIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          <Typography variant="subtitle1" color="text.secondary">
            {companyName}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
          <LocationOnIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          <Typography variant="body2" color="text.secondary">
            {location}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.primary" paragraph sx={{ minHeight: '80px' }}> 
          {/* text.primary for better readability of description */}
          {truncateDescription(description, 120)}
        </Typography>
        
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
           <CalendarTodayIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
           <Typography variant="caption" display="block">
            Posted: {postedDate} 
           </Typography>
        </Box>
        <Button 
          size="small" 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to={`/jobs/${id || 'na'}`} 
        > 
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default JobCard;
