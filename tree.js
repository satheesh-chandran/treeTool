'use strict';

const createDivision = function (style) {
  const division = document.createElement('div');
  division.classList.add(style);
  return division;
};

const visualize = function (tree, parentElement) {
  if (tree == null) return;
  const divisions = ['text', 'side', 'side'].map(createDivision);
  divisions.forEach(div => parentElement.appendChild(div));
  divisions[0].innerText = tree.value;
  visualize(tree.left, divisions[1]);
  visualize(tree.right, divisions[2]);
};

const generateRandomArray = function (count) {
  const numbers = [];
  while (numbers.length != count) {
    const num = Math.ceil(Math.random() * 100);
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers;
};

const createNode = function (value) {
  return { value, left: null, right: null };
};

const insertToTree = function (tree, value) {
  if (tree == null) return createNode(value);
  if (value < tree.value) {
    tree.left = insertToTree(tree.left, value);
    return tree;
  }
  tree.right = insertToTree(tree.right, value);
  return tree;
};

const trackInOrder = function (tree, list = []) {
  if (tree == null) return list;
  trackInOrder(tree.left, list);
  list.push(tree.value);
  trackInOrder(tree.right, list);
  return list;
};

const trackPreOrder = function (tree, list = []) {
  if (tree == null) return list;
  list.push(tree.value);
  trackPreOrder(tree.left, list);
  trackPreOrder(tree.right, list);
  return list;
};

const trackPostOrder = function (tree, list = []) {
  if (tree == null) return list;
  trackPreOrder(tree.left, list);
  trackPreOrder(tree.right, list);
  list.push(tree.value);
  return list;
};

const rightRotate = function (tree) {
  const temp = tree.left;
  tree.left = temp.right;
  temp.right = tree;
  return temp;
};

const leftRotate = function (tree) {
  const temp = tree.right;
  tree.right = temp.left;
  temp.left = tree;
  return temp;
};

const rotate = function (tree, value) {
  if (tree == null) return tree;
  if (tree.left && tree.left.value == value) {
    return rightRotate(tree);
  }
  if (tree.right && tree.right.value == value) {
    return leftRotate(tree);
  }
  if (value < tree.value) {
    tree.left = rotate(tree.left, value);
    return tree;
  }
  tree.right = rotate(tree.right, value);
  return tree;
};

const findMinNode = function (tree) {
  return tree.left == null ? tree : findMinNode(tree.left);
};

const findMaxNode = function (tree) {
  return tree.right == null ? tree : findMaxNode(tree.right);
};

const pushToLastAndDelete = function (tree) {
  if (tree.left === null && tree.right === null) return null;
  if (tree.left === null) return tree.right;
  if (tree.right === null) return tree.left;
  const minNode = findMinNode(tree.right);
  tree.value = minNode.value;
  tree.right = deleteNode(tree.right, minNode.value);
  return tree;
};

const deleteNode = function (tree, value) {
  if (tree == null) return null;
  if (value < tree.value) {
    tree.left = deleteNode(tree.left, value);
    return tree;
  }
  if (value > tree.value) {
    tree.right = deleteNode(tree.right, value);
    return tree;
  }
  return pushToLastAndDelete(tree);
};

const findMedianIndex = count => Math.floor((count - 1) / 2);

const makeNewInsertionOrder = function (source, arr = []) {
  if (source.length === 0) return arr;
  const middleIndex = findMedianIndex(source.length);
  arr.push(source[middleIndex]);
  makeNewInsertionOrder(source.slice(0, middleIndex), arr);
  makeNewInsertionOrder(source.slice(middleIndex + 1, source.length), arr);
  return arr;
};

const balance = tree =>
  makeNewInsertionOrder(trackInOrder(tree)).reduce(insertToTree, null);

const findMaxDepth = function (tree) {
  if (tree == null) return 0;
  return Math.max(findMaxDepth(tree.left), findMaxDepth(tree.right)) + 1;
};

const isBalanced = function (tree) {
  if (tree == null) return true;
  const leftDepth = findMaxDepth(tree.left);
  const rightDepth = findMaxDepth(tree.right);
  const absoluteRange = Math.abs(leftDepth - rightDepth);
  return absoluteRange <= 1 && isBalanced(tree.left) && isBalanced(tree.right);
};

const getHeightRange = function (tree) {
  if (tree == null) return 0;
  const leftDepth = findMaxDepth(tree.left);
  const rightDepth = findMaxDepth(tree.right);
  return leftDepth - rightDepth;
};

const rotateBasedOnHeight = function (tree, value) {
  const heightRange = getHeightRange(tree);
  if (heightRange > 1 && value < tree.left.value) return rightRotate(tree);
  if (heightRange < -1 && value > tree.right.value) return leftRotate(tree);
  if (heightRange > 1 && value > tree.left.value) {
    tree.left = leftRotate(tree.left);
    return rightRotate(tree);
  }
  if (heightRange < -1 && value < tree.right.value) {
    tree.right = rightRotate(tree.right);
    return leftRotate(tree);
  }
  return tree;
};

const insertAndBalance = function (tree, value) {
  if (tree == null) return createNode(value);
  if (value < tree.value) tree.left = insertAndBalance(tree.left, value);
  else tree.right = insertAndBalance(tree.right, value);
  return rotateBasedOnHeight(tree, value);
};

const deepestNode = function (node, deepest, level = 0) {
  if (node == null) return null;
  if (level > deepest.level) {
    deepest.node = node;
    deepest.level = level;
  }
  deepestNode(node.left, deepest, level + 1);
  deepestNode(node.right, deepest, level + 1);
  return deepest.node;
};

const balanceByRotation = function (tree) {
  if (tree == null) return tree;
  let copy = tree;
  const deepestChild = deepestNode(tree, { level: -1, node: null });
  while (copy.value != deepestChild.value) {
    if (isBalanced(copy)) return copy;
    copy = rotate(copy, deepestChild.value);
  }
  const leftDepth = findMaxDepth(copy.left);
  const rightDepth = findMaxDepth(copy.right);
  if (leftDepth == rightDepth && leftDepth != 0) {
    copy.left = balanceByRotation(copy.left);
    copy.right = balanceByRotation(copy.right);
    return copy;
  }
  return balanceByRotation(copy);
};

const main = function () {
  // const list = [82, 1, 72, 50, 14, 99, 97, 37, 53, 80, 19, 98, 23];
  // const list = [5, 3, 8, 1, 4, 7, 9];
  const list = generateRandomArray(31);
  let tree = list.reduce(insertToTree, null);
  // tree = balance(tree);
  // let tree = list.reduce(insertAndBalance, null);

  tree = balanceByRotation(tree);
  console.log(isBalanced(tree));
  visualize(tree, document.querySelector('#container'));
};

window.onload = main;
