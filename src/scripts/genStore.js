import Store from 'electron-store';

export default new Store({
  animes: {
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          title: {
            type: 'string'
          },
          episodes: {
            type: 'number',
            default: 0
          }
        },
        required: ['id', 'title', 'episodes']
      }
    }
  },
  bounds: {
    type: 'object',
    properties: {
      x: {
        type: 'number'
      },
      y: {
        type: 'number'
      },
      width: {
        type: 'number'
      },
      height: {
        type: 'number'
      }
    },
    required: ['x', 'y', 'width', 'height']
  }
}); 