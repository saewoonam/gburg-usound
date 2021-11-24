#include <math.h>
#include "peak_mark.h"
#include <stddef.h>
#include <stdlib.h>
#include <stdio.h>


void free_results(pk_result_t *results) {
    pk_result_t *next;
    while (results != NULL) {
        /* printf("free %lx\r\n", results); */
        next = results->next;
        free(results);
        results = NULL;
        results = next;
    }
}

pk_result_t * peakMark(double *y, int N, settings_t *settings, history_t *history, double *filteredY, double *signal, double *debug) {
    pk_result_t *results = NULL;
    pk_result_t *last_result = NULL;
    pk_result_t *new_result;
    double avgFilter = history->avg;
    double std2 = history->std2;
    double prevAvg, stdFilter;
    double oldValue;
    int lag = settings->lag;
    int width = settings->width;
    double influence = settings->influence;
    double threshold = settings->threshold;
    int start = history->start;
    int length = history->length;
    int pk_idx = history->pkidx;
    double pk = history->pk;
    int time_since_pk = history->time_since_pk;
    int time_pk = history->time_pk;
    int init = history->init;
    int offset = history->offset;

    for (int i=0; i<N; i++) {
        prevAvg = avgFilter;
        oldValue = filteredY[(i+offset)%lag];
        stdFilter = sqrt(std2);
        time_since_pk++;
        debug[i] = fabs(y[i] - avgFilter);
        if (((y[i] - avgFilter) > threshold * stdFilter) && (init>=lag)) {
            if (y[i] > avgFilter) {
                signal[i] = 1;
                if (start<0) {
                    start = i; length = 1;
                } else {
                    length += 1;
                }
                if (y[i]>pk) {
                    pk = y[i]; pk_idx = i;
                    time_pk = time_since_pk;
                }
            }
            filteredY[(offset + i)%lag] = influence * y[i] + (1 - influence) * filteredY[(offset + i-1 + lag)%lag];
        } else {
            if (init<lag) init++;
            signal[i] = 0;
            filteredY[(offset + i) %lag] = y[i];
            if ((start>0) && (length>width)) {
                new_result = calloc(1, sizeof(pk_result_t));
                new_result->start = start;
                new_result->length = length;
                new_result->pk = pk;
                new_result->pk_idx = pk_idx;
                new_result->pk_time = time_pk;
                new_result->next = NULL;
                /* printf("allocated: %lx\r\n", new_result); */
                if (results==NULL) {
                    results = new_result;
                } else {
                    last_result->next = new_result;
                }
                last_result = new_result;
                /* start = -1; */
                /* length = 0; */
                /* pk_idx = -1; */
                /* pk = -1; */
                time_since_pk = time_since_pk - time_pk;
            }
            start = -1;
            length = 0;
            pk_idx = -1;
            pk = -1;
        }
        /* if (start>0) */ 
        /*     printf("%d %d %d %d\r\n", i, start, length, pk_idx); */
        prevAvg = avgFilter;
        avgFilter = avgFilter + (filteredY[(offset+i)%lag] - oldValue) / lag;
        std2 = std2 + (filteredY[(offset+i)%lag] - oldValue)*(filteredY[(offset+i)%lag] + oldValue - avgFilter - prevAvg) /lag;

    }
    history->avg = avgFilter;
    history->std2 = std2;
    history->time_since_pk = time_since_pk;
    history->time_pk = time_pk;
    history->start = start;
    history->length = length;
    history->pkidx = pk_idx;
    history->pk = pk;
    history->init = init;
    history->offset = (offset + N) % lag;
    return results;
}

