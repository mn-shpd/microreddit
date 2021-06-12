  export default {
    methods: {
      formatDate(dateToFormat) {
          const date = new Date(dateToFormat);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
      }
    }
};

