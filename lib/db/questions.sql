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
-- Name: question; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE question (
    id integer NOT NULL,
    "qId" integer NOT NULL,
    section character varying NOT NULL,
    rparty character varying DEFAULT 1 NOT NULL,
    levelname character varying(255) NOT NULL,
    sorder integer NOT NULL,
    ismandatory boolean DEFAULT false NOT NULL,
    childerns json,
    haschild integer DEFAULT 0,
    qdescription character varying(1000),
    checklist character varying,
    lforbrief character varying,
    datatype character varying NOT NULL,
    dd1 character varying,
    dd2 character varying,
    dd3 character varying,
    dd4 character varying,
    dd5 character varying,
    dd6 character varying,
    dd7 character varying,
    dd8 character varying,
    dd1logic character varying,
    dd2logic character varying,
    dd3logic character varying,
    dd4logic character varying,
    dd5logic character varying,
    dd6logic character varying,
    dd7logic character varying,
    dd8logic character varying
);


ALTER TABLE public.question OWNER TO logix;

--
-- Name: question_id_seq; Type: SEQUENCE; Schema: public; Owner: logix
--

CREATE SEQUENCE question_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_id_seq OWNER TO logix;

--
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logix
--

ALTER SEQUENCE question_id_seq OWNED BY question.id;


--
-- Name: question_lforbrief_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE question_lforbrief_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_lforbrief_seq OWNER TO logix;

--
-- Name: question_lforbrief_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logix
--

ALTER SEQUENCE question_lforbrief_seq OWNED BY question.lforbrief;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY question ALTER COLUMN id SET DEFAULT nextval('question_id_seq'::regclass);


--
-- Name: question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: question_qId_key; Type: CONSTRAINT; Schema: public; Owner: logix; Tablespace:
--

ALTER TABLE ONLY question
    ADD CONSTRAINT "question_qId_key" UNIQUE ("qId");


--
-- PostgreSQL database dump complete
--
