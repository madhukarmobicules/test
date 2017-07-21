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
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE users (
    createdat integer,
    updatedat timestamp without time zone,
    email character varying(255),
    password character varying,
    isemailverified boolean DEFAULT false,
    status integer DEFAULT 1,
    loginfailure integer DEFAULT 0,
    lastlogin character varying,
    lastlogout character varying DEFAULT 0,
    fpexpairytime integer,
    emailverificationtoken character varying(1000),
    uid integer NOT NULL,
    accesstoken character varying(1000),
    resetpasswordtoken character varying(1000)
);


ALTER TABLE public.users OWNER TO logix;

--
-- Name: users_uid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_uid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_uid_seq OWNER TO logix;

--
-- Name: users_uid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_uid_seq OWNED BY users.uid;


--
-- Name: uid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN uid SET DEFAULT nextval('users_uid_seq'::regclass);


--
-- PostgreSQL database dump complete
--
