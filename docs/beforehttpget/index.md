---
title: "Before;Httpget Command"
---


The `Before;HTTPGet` command is a specific instruction used in email content to retrieve content from a URL *once* at the beginning of an email send. The retrieved content is then cached and made available to all subscribers in that send job.

This command is distinct from the `HTTPGet()` function, which executes a separate API call for each individual subscriber.

> NOTE: This command is designed for email send contexts only.

### Syntax

```html
%%before;httpget <URL>%%
```

### Example 1: Fetching a JSON Feed for a Send

```html
%%before;httpget https://api.example.com/latest-posts.json%%
%%[
  VAR @json, @posts, @rowCount, @i

  SET @json = AttributeValue("_Source_")

  IF NOT EMPTY(@json) THEN
    SET @posts = BuildRowsetFromJSON(@json, "items")
    SET @rowCount = RowCount(@posts)

    IF @rowCount > 0 THEN
      FOR @i = 1 TO @rowCount DO
        VAR @title, @url, @postRow
        SET @postRow = Row(@posts, @i)
        SET @title = Field(@postRow, "title")
        SET @url = Field(@postRow, "url")
]%%
        <p><a href="%%=RedirectTo(@url)=%%">%%=v(@title)=%%</a></p>
%%[
      NEXT @i
    ENDIF
  ENDIF
]%%
```

### When to Use Before;HTTPGet vs. HTTPGet()

| Scenario | Approach |
|---|---|
| Content is the same for all subscribers | Before;HTTPGet |
| Content is personalized per subscriber | HTTPGet() |
