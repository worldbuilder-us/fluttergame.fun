
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: config.get('host'),
  port: config.get('port'),
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

if (config.get('prometheus_enabled')) {

  log.info('server.metrics.prometheus', { path: '/metrics' })

  const { register: prometheus } = require('./metrics')

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (req, h) => {
      return h.response(await prometheus.metrics())
    },
    options: {
      description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
      tags: ['system']
    }
  })

}

server.route({
  method: 'GET',
  path: '/api/v0/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/haste/leaderboards',
  handler: handlers.Leaderboards.index,
  options: {
    description: 'List Haste Leaderboards for a game',
    tags: ['api', 'leaderboards'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        leaderboards: Joi.array().items(Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          cost: Joi.number().required(),
          currency: Joi.string().required(),
          formattedName: Joi.string().required(),
          formattedCostString: Joi.string().required()
        })).required()
      }).label('Leaderboards')
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/haste/plays',
  handler: handlers.Plays.create,
  options: {
    description: 'Choose a leaderboard and play a game',
    tags: ['api', 'plays'],
    validate: {
      payload: Joi.object({
        leaderboard_id: Joi.string().required(),
        handcash_token: Joi.string().required()
      })
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('PlayCreated')
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/haste/scores',
  handler: handlers.Scores.create,
  options: {
    description: 'End the game and submit your solution',
    tags: ['api', 'plays'],
    validate: {
      payload: Joi.object({
        leaderboard_id: Joi.string().required(),
        handcash_token: Joi.string().required(),
        play: Joi.object().required(),
        score: Joi.number().required()
      })
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('PlayCreated')
    }
  }
})



var started = false

export async function start() {

  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'API Docs',
        version: Pack.version,
        description: 'Developer API Documentation \n\n *** DEVELOPERS *** \n\n Edit this file under `swaggerOptions` in `src/server.ts` to better describe your service.'
      },
      schemes: ['https'],
      host: 'http://localhost:8000',
      documentationPath: '/',
      grouping: 'tags'
    }

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    const HapiSwagger = require('hapi-swagger');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

    log.info('server.api.documentation.swagger', swaggerOptions)
  }

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}
