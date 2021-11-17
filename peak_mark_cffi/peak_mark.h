/* peak_mark.h */

typedef struct {
        int lag;
        int width;
        double threshold;
        double influence;
} settings_t;

typedef struct {
        double avg;
        double std2;
        double pk;
        int start;
        int length;
        int pkidx;
        int time_since_pk;
        int time_pk;
        int init;
        int offset;
} history_t;

typedef struct node {
   int start;
   int length;
   int pk_idx;
   int pk_time;
   double pk;
   struct node *next;
} pk_result_t;

void free(void *ptr);
void free_results(pk_result_t *results);

pk_result_t * peakMark(double *y, int N, settings_t *settings, history_t *history, double *filteredY, double *signal, double *debug);

