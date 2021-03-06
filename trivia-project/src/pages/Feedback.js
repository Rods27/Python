import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchGravatar } from '../services';
import chuck from '../img/chuck.gif';
import triste from '../img/triste.gif';

class Feedback extends React.Component {
  constructor() {
    super();
    this.fetchProfileImg = this.fetchProfileImg.bind(this);
    this.rankingStorage = this.rankingStorage.bind(this);
    this.state = {
      gif: null,
      gifWidth: null,
      feedback: ''
    }
  }

  async componentDidMount() {
    this.fetchProfileImg();
    this.rankingStorage();
    this.handleFeedback();
  }

  fetchProfileImg() {
    const { hashGravatar } = this.props;
    fetchGravatar(hashGravatar);
  }

  handleFeedback() {
    const { correct } = this.props;
    const limitCorrectAnswer = 3;
    if (correct < limitCorrectAnswer) {
      this.setState({
        gif: triste,
        gifWidth: '350',
        feedback: 'Poderia ser melhor...',
      })
    } else {
      this.setState({
        gif: chuck,
        gifWidth: '410',
        feedback: 'Mandou bem!',
      })
    }
  }

  rankingStorage() {
    const { hashGravatar, userName, score } = this.props;
    if (!localStorage.ranking) {
      localStorage.setItem('ranking', JSON.stringify([]));
    }
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    const updatedRanking = [
      ...ranking,
      {
        name: userName,
        score,
        picture: `https://www.gravatar.com/avatar/${hashGravatar}`,
      },
    ];
    localStorage.setItem('ranking', JSON.stringify(updatedRanking));
  }

  render() {
    const { hashGravatar, userName, correct, score } = this.props;
    const { gif, feedback, gifWidth } = this.state;
    console.log(gif)
    const src = `https://www.gravatar.com/avatar/${hashGravatar}`;
    return (
      <div className="feedback-container game-container">
        <div className="square-feedback square">
          <header className="profile-header" data-testid="header-player-name">
            <div className="profile-div">
              <div className="profile-rightside">
                <img
                  data-testid="header-profile-picture"
                  alt="profile"
                  src={ src }
                  width="120"
                  className="profile-img-feedback-ranking"
                />
                <p data-testid="header-player-name">
                  Jogador:
                  <span>{ userName }</span>
                </p>
              </div>
            </div>
            <h1 className="score">
              <p>
                Placar
                <span data-testid="header-score">{ score }</span>
              </p>
            </h1>
          </header>
          <section className="feedback-mid-container">
            <h1>{`Acertou: ${correct} pergunta(s)!`}</h1>
            <img src={ gif } alt="he aproves! or not.." width={ gifWidth } className="gif"/>
            <p data-testid="feedback-text">{ feedback }</p>
          </section>
          <div className="feedback-bottom-content">
            <footer className="feedback-footer">
              <Link to="/ranking">
                <button type="button" className="next ranking" data-testid="btn-ranking">
                  <span>Ranking</span>
                </button>
              </Link>
              <Link to="/">
                <button type="button" className="next" data-testid="btn-play-again">
                  <span>Jogar Novamente</span>
                </button>
              </Link>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hashGravatar: state.user.hash,
  userName: state.user.player.name,
  score: state.user.player.score,
  correct: state.user.player.correct,
});

Feedback.propTypes = {
  hashGravatar: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  correct: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Feedback);
