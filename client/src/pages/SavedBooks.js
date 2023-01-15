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
import { REMOVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";
import { removeBookId } from "../utils/localStorage";

import Auth from "../utils/auth";

const SavedBooks = () => {
  const [removeBook] = useMutation(REMOVE_BOOK);
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await removeBook({
        variables: {
          userId: Auth.getProfile().data._id,
          bookId: bookId,
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
              {userData.savedBooks.length
                ? `Viewing ${userData.savedBooks.length} saved ${
                    userData.savedBooks.length === 1 ? "book" : "books"
                  }:`
                : "You have no saved books!"}
            </h2>
            <CardColumns>
              {userData.savedBooks.map((book) => {
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
                        onClick={() => handleDeleteBook(book.bookId)}
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
