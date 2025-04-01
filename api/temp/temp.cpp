#include <iostream>

bool isPrime(int n) {
  if (n <= 1) return false;

  // Optimization: Only check divisibility up to the square root of n. 
  // If a number has a divisor greater than its square root, it must also have a divisor smaller than its square root.
  for (int i = 2; i * i <= n; ++i) { 
    if (n % i == 0) return false; 
  }
  return true;
}

int main() {
  int n = 8;
  if (isPrime(n)) {
    std::cout << n << " is a prime number." << std::endl;
  } else {
    std::cout << n << " is not a prime number." << std::endl;
  }
  return 0;
}