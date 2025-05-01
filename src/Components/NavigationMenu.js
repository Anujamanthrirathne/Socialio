import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QuizIcon from '@mui/icons-material/Quiz';
import EditNoteIcon from '@mui/icons-material/EditNote'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PendingIcon from '@mui/icons-material/Pending';
import SchoolIcon from '@mui/icons-material/School';

export const navigationMenu = [
    {
        title:"Home",
        icon:<HomeIcon/>,
        path:"/home"
    },
    
    {
        title:"Notifications",
        icon:<NotificationsIcon/>,
        path:"/notification"
    },
    
    {
        title: "Learning resources",  
        icon: <SchoolIcon />,  
        path: "/learning" 
      },
    
      {
        title: "Create-Resource",  
        icon: <SchoolIcon />,  
        path: "/create-learning" 
      },
    
      {
        title: "Quizzy Time",
        icon: <QuizIcon />,
        path: "/quizzy"
    },
    
    {
        title: "Create Quiz",
        icon: <EditNoteIcon />,
        path: "/create-quiz"
    },
    
    {
        title:"Profile",
        icon:<AccountCircleIcon/>,
        path:"/profile"
    },

  
    
    
]