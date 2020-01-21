import React, { useState } from "react"
import styled from "styled-components"
import Image from "gatsby-image"
import { StaticQuery, graphql } from "gatsby"

import { rhythm } from "../utils/typography"
import Button from "./button"

import addToMailchimp from "gatsby-plugin-mailchimp"

function Subscribe() {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [subscription, setSubscription] = useState(null)

  const handleSubmit = e => {
    e.preventDefault()
    if (isSubscribing) {
      return
    }
    setIsSubscribing(true)
    addToMailchimp(email, {
      FNAME: firstName,
    }).then(result => {
      console.log(result)
      setIsSubscribing(false)
      setSubscription(result)
    })
  }

  const SubscriptionForm = () => (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        name="firstname"
        placeholder="Your first name"
        required
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <Input
        type="email"
        name="email"
        placeholder="Your email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {subscription && subscription.result === "error" && (
        <p
          style={{ fontSize: 12, marginBottom: 15, color: "red" }}
          dangerouslySetInnerHTML={{ __html: subscription.msg }}
        ></p>
      )}
      <Button>{isSubscribing ? "Subscribing..." : "Subscribe"}</Button>
      <p
        style={{
          fontSize: 12,
          marginTop: 8,
          marginBottom: 0,
          color: "#CCCCCC",
        }}
      >
        I'm not going to send you span :).
      </p>
    </form>
  )

  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        return (
          <Container>
            <Row style={{ backgroundColor: "#F9FAFB" }}>
              <h3 style={{ marginTop: 0 }}>Subscribe to the Newsletter</h3>
              <p>Subscribe to get my latest content by email.</p>
              <Image
                fixed={data.emailIcon.childImageSharp.fixed}
                alt="Email icon"
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 50,
                }}
              />
            </Row>
            <Row>
              {subscription && subscription.result === "success" ? (
                <p>Thank you for subscribing!</p>
              ) : (
                <SubscriptionForm />
              )}
            </Row>
          </Container>
        )
      }}
    />
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  box-shadow: 0 2px 15px 0 rgba(210, 214, 220, 0.5);
  margin-bottom: 30px;
`

const Row = styled.div`
  flex: 1;
  padding: 30px;
`

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
`

const bioQuery = graphql`
  query SubscribeQuery {
    emailIcon: file(absolutePath: { regex: "/email.png/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export default Subscribe
