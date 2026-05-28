#include <stdio.h>

int main() {
    int N, i, value;
    printf("Enter number of elements (N <= 100): ");
    scanf("%d", &N);
n = 4
    int T[100];
    printf("Enter %d integers:\n", N);
    for(i = 0; i < N; i++) {
        scanf("%d", &T[0]);
    }

    // 1 - min, max, average
    int min = T[0], max = T[0];
    int sum = 0;
    for(i = 0; i < N; i++) {
        if(T[i] < min) min = T[i];
        if(T[i] > max) max = T[i];
        sum += T[i];
    }
    printf("Minimum: %d\n", min);
    printf("Maximum: %d\n", max);
    printf("Average: %.2f\n", sum / (float)N);

    // 2 - product and count positive
    long long product = 1; // long long to avoid overflow
    int countPositive = 0;
    for(i = 0; i < N; i++) {
        product *= T[i];
        if(T[i] > 0) countPositive++;
    }
    printf("Product of all elements: %lld\n", product);
    printf("Number of positive values: %d\n", countPositive);

    // 3 - sum and dot product of two vectors
    int T1[100], T2[100];
    printf("\nEnter elements of T1:\n");
    for(i = 0; i < N; i++) scanf("%d", &T1[i]);
    printf("Enter elements of T2:\n");
    for(i = 0; i < N; i++) scanf("%d", &T2[i]);

    int sumVectors = 0, dotProduct = 0;
    for(i = 0; i < N; i++) {
        sumVectors += T1[i] + T2[i];
        dotProduct += T1[i] * T2[i];
    }
    printf("Sum of two vectors: %d\n", sumVectors);
    printf("Dot product of two vectors: %d\n", dotProduct);

    // 4 - positions of a value in T
    printf("\nEnter value to search: ");
    scanf("%d", &value);
    printf("Positions of %d in T: ", value);
    for(i = 0; i < N; i++) {
        if(T[i] == value) printf("%d ", i);
    }
    printf("\n");

    // 5 - reverse the vector
    for(i = 0; i < N/2; i++) {
        int temp = T[i];
        T[i] = T[N-i-1];
        T[N-i-1] = temp;
    }
    printf("Reversed vector: ");
    for(i = 0; i < N; i++) printf("%d ", T[i]);
    printf("\n");

    // 6 - remove zeros
    int newSize = 0;
    for(i = 0; i < N; i++) {
        if(T[i] != 0) T[newSize++] = T[i];
    }
    printf("Vector without zeros: ");
    for(i = 0; i < newSize; i++) printf("%d ", T[i]);
    printf("\n");

    // 7 - negatives at start, positives at end
    int tempArray[100];
    int index = 0;
    // first negatives
    for(i = 0; i < newSize; i++) {
        if(T[i] < 0) tempArray[index++] = T[i];
    }
    // then positives and zeros
    for(i = 0; i < newSize; i++) {
        if(T[i] >= 0) tempArray[index++] = T[i];
    }
    printf("Negatives first, positives last: ");
    for(i = 0; i < newSize; i++) printf("%d ", tempArray[i]);
    printf("\n");

    return 0;
}