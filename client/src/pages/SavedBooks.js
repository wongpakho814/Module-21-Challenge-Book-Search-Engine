import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { DELETE_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { removeBookId } from "../utils/localStorage";

import Auth from "../utils/auth";

const SavedBooks = () => {
  const [deleteBook] = useMutation(DELETE_BOOK);
  const { loading, data } = useQuery(QUERY_ME);
  const me = data?.me;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (id, bookId) => {
    try {
      const { data } = await deleteBook({
        variables: {
          userId: Auth.getProfile().data._id,
          bookId: id,
        },
      });
      if(!data) {
        console.log("Something went wrong when deleting!");
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Jumbotron fluid className="text-light bg-dark">
            <Container>
              <h1>Viewing saved books!</h1>
            </Container>
          </Jumbotron>
          <Container>
            <h2>
              {me.savedBooks.length
                ? `Viewing ${me.savedBooks.length} saved ${
                    me.savedBooks.length === 1 ? "book" : "books"
                  }:`
                : "You have no saved books!"}
            </h2>
            <CardColumns>
              {me.savedBooks.map((book) => {
                return (
                  <Card key={book.bookId} border="dark">
                    {book.image ? (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className="small">Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteBook(book._id, book.bookId)}
                      >
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </CardColumns>
          </Container>
        </>
      )}
    </>
  );
};

export default SavedBooks;
