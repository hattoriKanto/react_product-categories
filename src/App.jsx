/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import "./App.scss";
import classNames from "classnames";

import usersFromServer from "./api/users";
import categoriesFromServer from "./api/categories";
import productsFromServer from "./api/products";

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

function preparedProducts(selectedUser) {
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

  return products;
}

export const App = () => {
  const users = [...usersFromServer];
  const [selectedUser, setSelectedUser] = useState("");
  const visibleProducts = preparedProducts(selectedUser);

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
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
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

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
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
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
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
        </div>
      </div>
    </div>
  );
};
