
# Data Structures:

## Benefits of Using an Algorithm with O(n) vs O(log n) Time Complexity:

- **O(n)**: when the problem involves processing each element individually as in searching or sorting tasks where all elements need to be checked. However, as the input size grows the execution time increases proportionally, which can become inefficient with very large datasets.

- **O(log n)**: It is commonly seen in binary search, tree operations, and divide-and-conquer algorithms. It is ideal for problems where the input can be divided into smaller parts and processed iteratively or recursively, reducing the number of operations required.

## Benefits of Using Stacks and Queues:

- **Stacks**:
    - **LIFO (Last In, First Out)** structure
    - Useful for problems involving recursion, backtracking, depth-first search (DFS).
    - Operations are simple and efficient Example: push and pop.
- **Queues**:
    - **FIFO (First In, First Out)** structure
    - Ideal for scenarios where elements need to be processed in the order they were added, such as in breadth-first search (BFS).
    - Used in buffering and streaming applications to ensure orderly processing of data.

## Leetcode Exercises 179 & 21:

- **Leetcode 179: Largest Number**

    class Solution:
        def largestNumber(nums):
            num_strs = []
            for num in nums:
                num_strs.append(str(num))
            def compare(a, b):
                if a + b > b + a:
                    return -1 
                elif a + b < b + a:
                    return 1   
                return 0
            n = len(num_strs)
            for i in range(n):
                for j in range(0, n-i-1):
                    if compare(num_strs[j], num_strs[j+1]) > 0:
                        num_strs[j], num_strs[j+1] = num_strs[j+1], num_strs[j]  
            result = ''.join(num_strs)
            if result[0] == '0':
                return '0'
            return result

- **Leetcode 21: Merge Two Sorted Lists**
    
    class ListNode:
        def __init__(self, val=0, next=None):
            self.val = val
            self.next = next
    class Solution:
        def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
            dummy = ListNode()
            current = dummy
            while list1 is not None and list2 is not None:
                if list1.val < list2.val:
                    current.next = list1
                    list1 = list1.next
                else:
                    current.next = list2
                    list2 = list2.next
                current = current.next
            if list1 is not None:
                current.next = list1
            else:
                current.next = list2
            return dummy.next
