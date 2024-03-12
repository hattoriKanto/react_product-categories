/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import "./App.scss";
import classNames from "classnames";

import usersFromServer from "./api/users";
import categoriesFromServer from "./api/categories";
import productsFromServer from "./api/products";

const SORT_BY_ID = "id";
const SORT_BY_NAME = "name";
const SORT_BY_CATEGORY = "category";
const SORT_BY_USER = "user";

function preparedProducts(selectedUser, query, sortBy) {
  let products = [...productsFromServer].map((product) => {
    const category = getCategoryById(product.categoryId);
    const user = getUserById(category.ownerId);

    return [product, category, user];
  });

  function getCategoryById(categoryId) {
    return categoriesFromServer.find((category) => category.id === categoryId);
  }

  function getUserById(userId) {
    return usersFromServer.find((user) => user.id === userId);
  }

  if (selectedUser) {
    products = products.filter((product) => {
      const [, , userInfo] = product;

      return userInfo.id === selectedUser.id;
    });
  }

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();

    products = products.filter((product) => {
      const [productInfo] = product;
      const normalizedName = productInfo.name.trim().toLowerCase();

      return normalizedName.includes(normalizedQuery);
    });
  }

  if (sortBy) {
    products = products.sort((product1, product2) => {
      const [productInfo1, categoryInfo1, userInfo1] = product1;
      const [productInfo2, categoryInfo2, userInfo2] = product2;

      switch (sortBy) {
        case SORT_BY_ID:
          return productInfo1.id - productInfo2.id;
        case SORT_BY_NAME:
          return productInfo1.name.localeCompare(productInfo2.name);
        case SORT_BY_CATEGORY:
          return categoryInfo1.title.localeCompare(categoryInfo2.title);
        case SORT_BY_USER:
          return userInfo1.name.localeCompare(userInfo2.name);
        default:
          return 0;
      }
    });
  }

  return products;
}

export const App = () => {
  const users = [...usersFromServer];
  const categories = [...categoriesFromServer];

  const [selectedUser, setSelectedUser] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [counterClickId, setCounterClickId] = useState(0);
  const [counterClickName, setCounterClickName] = useState(0);
  const [counterClickCategory, setCounterClickCategory] = useState(0);
  const [counterClickUser, setCounterClickUser] = useState(0);

  const visibleProducts = preparedProducts(selectedUser, querySearch, sortBy);

  const setCounter = (prevCounter) => {
    if (prevCounter === 3) {
      return 0;
    }

    return prevCounter + 1;
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                className={classNames({ "is-active": !selectedUser })}
                href="#/"
                onClick={() => {
                  setSelectedUser("");
                }}
              >
                All
              </a>

              {users.map((user) => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  className={classNames({
                    "is-active": selectedUser.id === user.id,
                  })}
                  href="#/"
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={querySearch}
                  onChange={(event) => setQuerySearch(event.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {querySearch && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuerySearch("")}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categories.map((category) => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_BY_ID);
                          setCounterClickId(setCounter);
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              "fas",
                              {
                                "fa-sort":
                                  counterClickId === 0 || counterClickId === 3,
                              },
                              {
                                "fa-sort-up": counterClickId === 1,
                              },
                              {
                                "fa-sort-down": counterClickId === 2,
                              }
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_BY_NAME);
                          setCounterClickName(setCounter);
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              "fas",
                              {
                                "fa-sort":
                                  counterClickName === 0 ||
                                  counterClickName === 3,
                              },
                              {
                                "fa-sort-up": counterClickName === 1,
                              },
                              {
                                "fa-sort-down": counterClickName === 2,
                              }
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_BY_CATEGORY);
                          setCounterClickCategory(setCounter);
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              "fas",
                              {
                                "fa-sort":
                                  counterClickCategory === 0 ||
                                  counterClickCategory === 3,
                              },
                              {
                                "fa-sort-up": counterClickCategory === 1,
                              },
                              {
                                "fa-sort-down": counterClickCategory === 2,
                              }
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_BY_USER);
                          setCounterClickUser(setCounter);
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              "fas",
                              {
                                "fa-sort":
                                  counterClickUser === 0 ||
                                  counterClickUser === 3,
                              },
                              {
                                "fa-sort-up": counterClickUser === 1,
                              },
                              {
                                "fa-sort-down": counterClickUser === 2,
                              }
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => {
                  const [productInfo, categoryInfo, userInfo] = product;
                  const isFemale = userInfo.sex === "f";

                  return (
                    <tr key={productInfo.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {productInfo.id}
                      </td>

                      <td data-cy="ProductName">{productInfo.name}</td>
                      <td data-cy="ProductCategory">{`${categoryInfo.icon} - ${categoryInfo.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames("has-text-link", {
                          "has-text-danger": isFemale,
                        })}
                      >
                        {userInfo.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
