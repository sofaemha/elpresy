declare module 'ml-cart' {
  /**
   * Options for Decision Tree Regression
   */
  export interface DecisionTreeRegressionOptions {
    /**
     * Gain function to get the best split. "regression" is the only one supported.
     * @default "regression"
     */
    gainFunction?: string;

    /**
     * Given two integers from a split feature, get the value to split. "mean" is the only one supported.
     * @default "mean"
     */
    splitFunction?: string;

    /**
     * Minimum number of samples to create a leaf node to decide a class.
     * @default 3
     */
    minNumSamples?: number;

    /**
     * Max depth of the tree.
     * @default Infinity
     */
    maxDepth?: number;

    kind?: 'regression';
  }

  /**
   * Serialized Decision Tree Regression model
   */
  export interface DecisionTreeRegressionModel {
    options: DecisionTreeRegressionOptions;
    root: TreeNode;
    name: 'DTRegression';
  }

  /**
   * Matrix-like input types
   */
  export type MatrixLike = number[] | number[][] | Matrix | MatrixTransposeView;

  /**
   * Matrix interface
   */
  export interface Matrix {
    rows: number;
    columns: number;
    data: number[][];
    getRow(index: number): number[];
    getColumn(index: number): number[];
  }

  /**
   * Matrix Transpose View interface
   */
  export interface MatrixTransposeView {
    rows: number;
    columns: number;
  }

  /**
   * TreeNode class for internal tree structure
   */
  export class TreeNode {
    constructor(options: DecisionTreeRegressionOptions);
    setNodeParameters(model: any): void;
    train(
      trainingSet: Matrix | MatrixTransposeView,
      trainingValues: number[],
      depth: number
    ): void;
    classify(sample: number[]): number;
  }

  /**
   * Decision Tree Regression with CART implementation
   */
  export class DecisionTreeRegression {
    /**
     * Create new Decision Tree Regression with CART implementation with the given options.
     * @param options - Configuration options
     */
    constructor(options?: DecisionTreeRegressionOptions);

    /**
     * Internal constructor for loading from a model
     * @internal
     */
    constructor(
      shouldLoad: true,
      model: DecisionTreeRegressionModel
    );

    options: DecisionTreeRegressionOptions;
    root: TreeNode;

    /**
     * Train the decision tree with the given training set and values.
     * @param trainingSet - Training data matrix
     * @param trainingValues - Target values for training
     */
    train(trainingSet: MatrixLike, trainingValues: number[]): void;

    /**
     * Predicts the values given the matrix to predict.
     * @param toPredict - Data to make predictions on
     * @return predictions - Array of predicted values
     */
    predict(toPredict: MatrixLike): number[];

    /**
     * Export the current model to JSON.
     * @return Current model
     */
    toJSON(): DecisionTreeRegressionModel;

    /**
     * Load a Decision tree regression with the given model.
     * @param model - Serialized model
     * @return Loaded DecisionTreeRegression instance
     */
    static load(model: DecisionTreeRegressionModel): DecisionTreeRegression;
  }
}