import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

export default function SecretInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  const [isHiding, setIsHiding] = useState<boolean>(true);

  return (
    <InputGroup>
      <InputGroupInput {...props} type={isHiding ? 'password' : 'text'} />
      <InputGroupButton
        onClick={() => setIsHiding(!isHiding)}
        size="icon-sm"
        variant="ghost"
        className="mr-1 cursor-pointer"
      >
        {isHiding ? (
          <EyeOffIcon />
        ) : (
          <EyeIcon />
        )}
      </InputGroupButton>
    </InputGroup>
  );
}
