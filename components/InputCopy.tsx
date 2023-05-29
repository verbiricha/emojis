import {
  useToast,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";

import useCopy from "@emoji/hooks/useCopy";

export default function InputCopy({ text, ...rest }) {
  const toast = useToast();
  const { copy } = useCopy();

  const handleClick = () => {
    copy(text);
    toast({ description: "Copied to clipboard" });
  };

  return (
    <InputGroup size="md" {...rest}>
      <Input readOnly pr="4.5rem" type="text" value={text} />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          Copy
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
