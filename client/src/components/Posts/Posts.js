import React from 'react'
import { Grid, CircularProgress} from '@material-ui/core'
import { useSelector } from 'react-redux';

import Post from './Post/Post.js'
import useStyles from './styles'

export default function Posts({currentId, setCurrentId}) {
  const posts = useSelector((state) => state.posts);
  const classes = useStyles();
  console.log(posts);
  return (
    !posts.length ? <CircularProgress /> : (
      <Grid className={classes.mainContainer} container alignItems='stretch' spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} key={post.id}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  )
}
