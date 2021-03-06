import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  Grid,
  withStyles,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Button,
} from '@material-ui/core'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowRightAlt as ArrowRightIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'

import { orderBy } from 'lodash'
import { compose } from 'recompose'

import { isAuthenticated } from '../services/auth'
import api from '../services/api'
import PropTypes from 'prop-types'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  posts: {
    marginTop: 2 * theme.spacing.unit,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  fab: {
    position: 'absolute',
    bottom: 3 * theme.spacing.unit,
    right: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      bottom: 2 * theme.spacing.unit,
      right: 2 * theme.spacing.unit,
    },
  },
})

class TeamDetail extends Component {
  state = {
    loading: true,
    team: {},
  }

  componentDidMount() {
    this.getTeam()
  }

  async getTeam() {
    const { team_id } = this.props.match.params
    const team = await api.get(`/teams/${team_id}`)
    this.setState({
      loading: false,
      team: team.data,
    })
  }

  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>Informações do Time</Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.team ? (
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs={6}>
                  <Typography>Time: {this.state.team.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Total: {this.state.team.total}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {this.state.team.orders ? (
                    <Paper elevation={1} className={classes.orders}>
                      <List>
                        {orderBy(
                          this.state.team.orders,
                          ['createdAt'],
                          ['desc']
                        ).map(order => (
                          <ListItem
                            className={classes.listItem}
                            key={order.id}
                            button
                            component={Link}
                            to={`/teams/${this.state.team.id}/orders/${order.id}`}
                          >
                            <ListItemText
                              primary={`Total: ${order.total}`}
                              secondary={order.created_at}
                            />
                            <ListItemSecondaryAction>
                              <IconButton color="inherit">
                                <ArrowRightIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ) : (
                    !this.state.loading && (
                      <Typography variant="subheading">
                        Sem compras feitas até o momento!
                      </Typography>
                    )
                  )}
                </Grid>
              </Grid>
            ) : (
              !this.state.loading && (
                <Typography variant="subheading">Time inválido</Typography>
              )
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="default"
              onClick={() => this.props.history.goBack()}
            >
              Voltar
              <ArrowBackIcon />
            </Button>
          </Grid>
        </Grid>
        <Link to={`/teams/${this.state.team.id}/orders/new`}>
          <Fab color="primary" aria-label="Add" className={classes.fab}>
            <AddIcon />
          </Fab>
        </Link>
      </Fragment>
    )
  }
}

TeamDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
  withStyles(styles)
)(TeamDetail)
