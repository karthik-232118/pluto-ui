import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/styles';
import arrow from '../../assets/svg/SideBar/arrow.svg';
import { getSopsCategory } from '../../store/sops/slice';

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1.4),
  paddingLeft: theme.spacing(2),
  height: '43px',
  color: '#475569',
  stroke: '#3B82F6',
  '&:hover': {
    backgroundColor: '#F2F4FE',
    color: '#3B82F6',
    borderRadius: '10px',
    '& .MuiListItemIcon-root svg': {
      stroke: '#3B82F6',
      color: '#3B82F6',
    },
    '& .MuiListItemIcon-root img, & .arrow-hover': {
      filter: 'invert(32%) sepia(100%) saturate(3345%) hue-rotate(211deg) brightness(96%) contrast(101%)',
    },
  },
}));

const ListItemIconStyled = styled()(() => ({
  minWidth: '35px',
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontFamily: 'var(--fontfamilysans)',
  fontSize: 'var(--fontsizesm)',
  fontWeight: 500,
  lineHeight: 'var(--fontline-height5)',
  letterSpacing: 'var(--fontletter-spacingnormal)',
  textAlign: 'left',
  fontVariationSettings: "'slnt' 0",
}));

const SopsSidebar = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.sops);

  useEffect(() => {
    dispatch(getSopsCategory());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const sopsMenuItems = categories.map((category) => ({
    text: category.name,
    link: `/sops/${category.id}`,
  }));

  return (
    <div>
      <h2>SOPs Categories</h2>
      <List>
        {sopsMenuItems.map((item) => (
          <ListItemStyled
            key={item.link}
            button
            component={Link}
            to={item.link}
          >
            <ListItemIconStyled>
              <img src={arrow} alt="arrow" className="arrow-hover" />
            </ListItemIconStyled>
            <ListItemTextStyled primary={item.text} />
          </ListItemStyled>
        ))}
      </List>
    </div>
  );
};

export default SopsSidebar;
