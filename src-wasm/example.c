#include <stdlib.h>
#include <stdio.h>
#include <locale.h>
#include <wchar.h>

__attribute__((used)) double* multiply_arrays_int32_by_int32 (int* array1, int* array2, unsigned int length)
{
  int* result = (int*) malloc(length * sizeof(int));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] * array2[i];
  }

  return result;
}

__attribute__((used)) float* multiply_arrays_float32_by_float32 (float* array1, float* array2, unsigned int length)
{
  float* result = (float*) malloc(length * sizeof(float));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] * array2[i];
  }

  return result;
}

__attribute__((used)) double* multiply_arrays_float64_by_float64 (double* array1, double* array2, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] * array2[i];
  }

  return result;
}
