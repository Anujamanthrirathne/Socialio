import React from 'react';
import { navigationMenu } from './NavigationMenu';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/Auth/action';

const Navigation = () => {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
   const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('logout');
    handleClose();
     dispatch(logout())
  };



  const { auth } = useSelector((store) => store);

  return (
    

        {/* Navigation Menu */}
        <div className="space-y-6">
          {navigationMenu.map((item) => (
            <div
              key={item.title}
              className="cursor-pointer flex space-x-3 items-center hover:bg-gray-100 p-2 rounded-md"
              onClick={() =>
                item.title === 'Profile'
                  ? navigate(`/profile/${auth.user?.id || 5}`)
                  : navigate(item.path)
              }
            >
              {item.icon}
              <p className="text-xl">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Tweet Button */}
        <div className="py-10">
          <Button
            sx={{
              width: '100%',
              borderRadius: '29px',
              py: '10px',
              bgcolor: '#1d9bf0',
              fontSize: '14px',
              textTransform: 'none',
            }}
            variant="contained"
          >
            Tweet
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center justify-between py-4 w-full border-t pt-4 mt-2">
        <div className="flex items-center space-x-3 w-full overflow-hidden">
          <Avatar
            alt={auth.user?.name || 'User'}
            src={
              auth.user?.profilePicture ||
              'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png'
            }
            sx={{ width: 45, height: 45 }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{auth.user?.name || 'Guest'}</p>
            <p className="text-sm text-gray-500 truncate">
              @{auth.user?.name?.split(' ').join('_').toLowerCase() || 'guest'}
            </p>
          </div>

          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </Button>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
