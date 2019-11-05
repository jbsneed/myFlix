import React from 'react';

export class MovieCard extends React.Component {
  render() {
    //This is given to the <MovieCard/> component by the outer world
    //which in this case, is 'MainView', as 'MainView' is what's
    //connected to your database vai the movies endpoint of your API
    const { movie, onClick } = this.props;

    return (
      <div onClick={() => onClick(movie)} className="movie-card">{movie.Title}</div>
    );
  }
}