--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: userRoles; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "userRoles" (
    id integer NOT NULL,
    uid integer,
    rid integer,
    createdat integer,
    updatedat timestamp without time zone
);


ALTER TABLE public."userRoles" OWNER TO logix;

--
-- Name: userRoles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "userRoles"
    ADD CONSTRAINT "userRoles_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
